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
        private readonly IPhotoRepository _photoRepository; // Servicio que contiene la lógica principal de negocio para Reports.
        private readonly ContextDB _dbContext;
        private readonly IFileStorage _fileStorage;

        public RentsController(ILogger<RentsController> logger, IMapper mapper, IRentRepository rentRepository, IPhotoRepository photoRepository, IFileStorage fileStorage, ContextDB dbContext
        )
        : base(mapper, logger, rentRepository)
        {
            _response = new();
            _rentRepository = rentRepository;
            _photoRepository = photoRepository;
            _fileStorage = fileStorage;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetRent")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Rent, RentDTO>(paginationDTO: paginationDTO);
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
                        IncludeExpression = b => b.ListTenants
                    },
                    new IncludePropertyConfiguration<Rent>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
                };
            return await Get<Rent, RentDTO>(includes: includes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Rent>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] RentCreateDTO rentCreateDTO)
        {
            return await Put<RentCreateDTO, RentDTO, Rent>(id, rentCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<RentPatchDTO> patchDto)
        {
            return await Patch<Rent, RentPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateRent")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
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
                    _logger.LogError($"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"La propiedad ID={rentCreateDto.EstateId} no existe en el sistema.");
                    return BadRequest(ModelState);
                }

                if (rentCreateDto.ListTenants != null && rentCreateDto.ListTenants.Count > 0)
                {
                    foreach (var tenant in rentCreateDto.ListTenants)
                    {
                        var tenantDB = await _dbContext.Tenant.FindAsync(tenant.Id);
                        if (tenantDB == null)
                        {
                            _logger.LogError($"El inquilino ID={tenant.Id} no existe en el sistema");
                            _response.ErrorMessages = new List<string> { $"El inquilino ID={tenant.Id} no existe en el sistema." };
                            _response.IsSuccess = false;
                            _response.StatusCode = HttpStatusCode.BadRequest;
                            ModelState.AddModelError("NameAlreadyExists", $"El inquilino ID={tenant.Id} no existe en el sistema.");
                            return BadRequest(ModelState);
                        }
                    }
                }

                Rent modelo = _mapper.Map<Rent>(rentCreateDto);
                modelo.Estate = estate;
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                await _rentRepository.Create(modelo);
                _logger.LogInformation($"Se creó correctamente la propiedad Id:{modelo.Id}.");

                if (rentCreateDto.ListPhotos != null && rentCreateDto.ListPhotos.Count > 0)
                {
                    string dynamicContainer = $"uploads/reports/estate{estate.Id}/{DateTime.Now:yyyy_MM}/report{modelo.Id}";

                    foreach (var photoForm in rentCreateDto.ListPhotos)
                    {
                        Photo newPhoto = new();
                        newPhoto.Rent = modelo;

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

                _response.Result = _mapper.Map<RentDTO>(modelo);
                _response.StatusCode = HttpStatusCode.Created;

                // CreatedAtRoute -> Nombre de la ruta (del método): GetEstateById
                // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/13816172#notes
                return CreatedAtAction(nameof(Get), new { id = modelo.Id }, _response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return _response;
        }

        #endregion

        #region Private methods

        #endregion

    }
}