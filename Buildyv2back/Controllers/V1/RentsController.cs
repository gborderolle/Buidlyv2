using AutoMapper;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Buildyv2.Utilities;
using Buildyv2.Context;
using Buildyv2.Services;

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/rents")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RentsController : CustomBaseController<Rent> // Notice <Rent> here
    {
        private readonly IRentRepository _rentRepository; // Servicio que contiene la lógica principal de negocio para Rents.
        private readonly IEstateRepository _estateRepository; // Servicio que contiene la lógica principal de negocio para Reports.
        private readonly IPhotoRepository _photoRepository; // Servicio que contiene la lógica principal de negocio para Reports.
        private readonly ILogService _logService;
        private readonly ContextDB _dbContext;
        private readonly IFileStorage _fileStorage;

        public RentsController(ILogger<RentsController> logger, IMapper mapper, IRentRepository rentRepository, IEstateRepository estateRepository, IPhotoRepository photoRepository, IFileStorage fileStorage, ILogService logService, ContextDB dbContext
        )
        : base(mapper, logger, rentRepository)
        {
            _response = new();
            _rentRepository = rentRepository;
            _estateRepository = estateRepository;
            _photoRepository = photoRepository;
            _fileStorage = fileStorage;
            _logService = logService;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetRent")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            var includes = new List<IncludePropertyConfiguration<Rent>>
            {
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.Estate
                    },
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.ListTenants
                    },
            };
            return await Get<Rent, RentDTO>(paginationDTO: paginationDTO, includes: includes);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var rents = await _rentRepository.GetAll();
            _response.Result = _mapper.Map<List<RentDTO>>(rents);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Rents/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            // 1..n
            var includes = new List<IncludePropertyConfiguration<Rent>>
            {
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.Estate
                    },
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.ListTenants
                    },
            };
            return await Get<Rent, RentDTO>(includes: includes);
        }

        [HttpDelete("{id:int}", Name = "DeleteRent")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            try
            {
                var rent = await _rentRepository.Get(x => x.Id == id, tracked: true, includes: new List<IncludePropertyConfiguration<Rent>>
        {
            new IncludePropertyConfiguration<Rent>
            {
                IncludeExpression = j => j.ListPhotos
            }
        });

                if (rent == null)
                {
                    _logger.LogError($"Renta no encontrada ID = {id}.");
                    _response.ErrorMessages = new List<string> { $"Renta no encontrada ID = {id}." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound($"Renta no encontrada ID = {id}.");
                }
                string container = null;

                // Eliminar las fotos asociadas
                if (rent.ListPhotos != null)
                {
                    foreach (var photo in rent.ListPhotos)
                    {
                        container = $"uploads/rents/estate{rent.EstateId}/{photo.Creation.ToString("yyyy_MM")}/rent{rent.Id}";
                        await _fileStorage.DeleteFile(photo.URL, container);
                        _dbContext.Photo.Remove(photo); // Asegúrate de que el contexto de la base de datos sea correcto
                    }
                }

                if (container != null)
                {
                    // Eliminar la carpeta del contenedor una sola vez
                    await _fileStorage.DeleteFolder(container);
                }
                await _rentRepository.Remove(rent);

                _logger.LogInformation($"Se eliminó correctamente la renta Id:{id}.");
                await _logService.LogAction("Rent", "Delete", $"Id:{rent.Id}.", User.Identity.Name);

                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return BadRequest(_response);
        }

        [HttpPut("{id:int}")]
        [Consumes("multipart/form-data")] // Asegura que el método acepte multipart/form-data
        public async Task<ActionResult<APIResponse>> Put(int id, [FromForm] RentCreateDTO rentCreateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError($"Ocurrió un error en el servidor.");
                    _response.ErrorMessages = new List<string> { $"Ocurrió un error en el servidor." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(ModelState);
                }
                var estate = await _dbContext.Estate.FindAsync(rentCreateDto.EstateId);
                if (estate == null)
                {
                    _logger.LogError($"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema.");
                    _response.ErrorMessages = new List<string> { $"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound($"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema.");
                }

                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {

                    rentCreateDto.Warrant = Utils.ToCamelCase(str: rentCreateDto.Warrant);
                    rentCreateDto.Comments = Utils.ToCamelCase(str: rentCreateDto.Comments);
                    Rent rent = _mapper.Map<Rent>(rentCreateDto);
                    rent.Estate = estate;
                    rent.Creation = DateTime.Now;
                    rent.Update = DateTime.Now;

                    // Procesamiento de inquilinos
                    foreach (int tenantId in rentCreateDto.TenantIds)
                    {
                        var tenant = await _dbContext.Tenant.FindAsync(tenantId);
                        if (tenant == null)
                        {
                            return NotFound($"El inquilino ID={tenantId} no existe en el sistema.");
                        }
                        rent.ListTenants.Add(tenant);
                    }

                    await _rentRepository.Update(rent);

                    // Actualizar la propiedad
                    estate.PresentRentId = rent.Id;
                    estate.EstateIsRented = true;
                    await _estateRepository.Update(estate);

                    // Procesamiento de fotos
                    if (rentCreateDto.ListPhotos != null && rentCreateDto.ListPhotos.Count > 0)
                    {
                        await ProcessRentPhotos(rent, rentCreateDto.ListPhotos);
                    }

                    await transaction.CommitAsync();

                    _logger.LogInformation($"Se actualizó correctamente el contrato Id:{rent.Id}.");
                    await _logService.LogAction("Rent", "Update", $"Id:{rent.Id}, Nombre (propiedad): {estate.Name}.", User.Identity.Name);

                    _response.Result = _mapper.Map<RentDTO>(rent);
                    _response.StatusCode = HttpStatusCode.Created;

                    return Ok(_response);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
                return _response;
            }
        }

        [HttpPatch("{id:int}")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<RentPatchDTO> patchDto)
        {
            return await Patch<Rent, RentPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateRent")]
        public async Task<ActionResult<APIResponse>> Post([FromForm] RentCreateDTO rentCreateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError($"Ocurrió un error en el servidor.");
                    _response.ErrorMessages = new List<string> { $"Ocurrió un error en el servidor." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(ModelState);
                }
                var estate = await _dbContext.Estate.FindAsync(rentCreateDto.EstateId);
                if (estate == null)
                {
                    _logger.LogError($"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema.");
                    _response.ErrorMessages = new List<string> { $"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound($"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema.");
                }

                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {

                    rentCreateDto.Warrant = Utils.ToCamelCase(rentCreateDto.Warrant);
                    Rent rent = _mapper.Map<Rent>(rentCreateDto);
                    rent.Estate = estate;
                    rent.Creation = DateTime.Now;
                    rent.Update = DateTime.Now;

                    // Procesamiento de inquilinos
                    foreach (int tenantId in rentCreateDto.TenantIds)
                    {
                        var tenant = await _dbContext.Tenant.FindAsync(tenantId);
                        if (tenant == null)
                        {
                            return NotFound($"El inquilino ID={tenantId} no existe en el sistema.");
                        }
                        rent.ListTenants.Add(tenant);
                    }

                    await _rentRepository.Create(rent);

                    // Actualizar la propiedad
                    estate.PresentRentId = rent.Id;
                    estate.EstateIsRented = true;
                    await _estateRepository.Update(estate);

                    // Procesamiento de fotos
                    if (rentCreateDto.ListPhotos != null && rentCreateDto.ListPhotos.Count > 0)
                    {
                        await ProcessRentPhotos(rent, rentCreateDto.ListPhotos);
                    }

                    await transaction.CommitAsync();

                    _logger.LogInformation($"Se creó correctamente el contrato Id:{rent.Id}.");
                    await _logService.LogAction("Rent", "Create", $"Id:{rent.Id}, Nombre (propiedad): {estate.Name}.", User.Identity.Name);

                    _response.Result = _mapper.Map<RentDTO>(rent);
                    _response.StatusCode = HttpStatusCode.Created;
                    return CreatedAtAction(nameof(Get), new { id = rent.Id }, _response);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
                return _response;
            }
        }

        private async Task ProcessRentPhotos(Rent rent, IEnumerable<IFormFile> photos)
        {
            string dynamicContainer = $"uploads/rents/estate{rent.EstateId}/{DateTime.Now:yyyy_MM}/rent{rent.Id}";
            foreach (var photoForm in photos)
            {
                Photo newPhoto = new() { Rent = rent };
                using (var stream = new MemoryStream())
                {
                    await photoForm.CopyToAsync(stream);
                    var content = stream.ToArray();
                    var extension = Path.GetExtension(photoForm.FileName);
                    newPhoto.URL = await _fileStorage.SaveFile(content, extension, dynamicContainer, photoForm.ContentType);
                }
                await _photoRepository.Create(newPhoto);
            }
        }

        #endregion

        #region Private methods

        #endregion

    }
}