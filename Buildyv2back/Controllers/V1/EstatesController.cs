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

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/estates")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class EstatesController : CustomBaseController<Estate> // Notice <Estate> here
    {
        private readonly IEstateRepository _estateRepository;
        private readonly IReportRepository _reportRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IRentRepository _rentRepository;
        private readonly ContextDB _dbContext;

        public EstatesController(ILogger<EstatesController> logger, IMapper mapper, IEstateRepository estateRepository, IReportRepository reportRepository, IJobRepository jobRepository, IRentRepository rentRepository, ContextDB dbContext)
        : base(mapper, logger, estateRepository)
        {
            _response = new();
            _estateRepository = estateRepository;
            _reportRepository = reportRepository;
            _jobRepository = jobRepository;
            _rentRepository = rentRepository;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetEstate")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            // 1..n
            var includes = new List<IncludePropertyConfiguration<Estate>>
            {
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.CityDS
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListReports
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListJobs
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListRents
                    }
                };
            // 1..n..n
            var thenIncludes = new List<ThenIncludePropertyConfiguration<Estate>>
            {
                    // actores
                    new ThenIncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListRents,
                        ThenIncludeExpression = ab => ((Rent)ab).ListPhotos
                    },
            };
            return await Get<Estate, EstateDTO>(paginationDTO: paginationDTO, includes: includes, thenIncludes: thenIncludes);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var estates = await _estateRepository.GetAll();
            _response.Result = _mapper.Map<List<EstateDTO>>(estates);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id}", Name = "GetEstateById")] // url completa: https://localhost:7003/api/Estates/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            // 1..n
            var includes = new List<IncludePropertyConfiguration<Estate>>
            {
                 new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.CityDS
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListReports
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListJobs
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListRents
                    }
                };
            // 1..n..n
            var thenIncludes = new List<ThenIncludePropertyConfiguration<Estate>>
            {
                    // actores
                    new ThenIncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListRents,
                        ThenIncludeExpression = ab => ((Rent)ab).ListPhotos
                    },
            };
            return await Get<Estate, EstateDTO>(includes: includes, thenIncludes: thenIncludes);
        }

        [HttpDelete("{id:int}", Name = "DeleteEstate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var estate = await _estateRepository.Get(x => x.Id == id, tracked: true, includes: new List<IncludePropertyConfiguration<Estate>>
            {
                new IncludePropertyConfiguration<Estate> { IncludeExpression = j => j.ListRents },
                new IncludePropertyConfiguration<Estate> { IncludeExpression = j => j.ListJobs },
                new IncludePropertyConfiguration<Estate> { IncludeExpression = j => j.ListReports },
            });

                    if (estate == null)
                    {
                        _logger.LogError($"Propiedad no encontrada ID = {id}.");
                        _response.ErrorMessages = new List<string> { $"Propiedad no encontrada ID = {id}." };
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        return NotFound($"Propiedad no encontrada ID = {id}.");
                    }

                    // Crear listas temporales para eliminar elementos
                    var rentsToRemove = estate.ListRents?.ToList() ?? new List<Rent>();
                    var jobsToRemove = estate.ListJobs?.ToList() ?? new List<Job>();
                    var reportsToRemove = estate.ListReports?.ToList() ?? new List<Report>();

                    // Eliminar elementos fuera del bucle
                    foreach (var rent in rentsToRemove)
                    {
                        await _rentRepository.Remove(rent);
                    }
                    foreach (var job in jobsToRemove)
                    {
                        await _jobRepository.Remove(job);
                    }
                    foreach (var report in reportsToRemove)
                    {
                        await _reportRepository.Remove(report);
                    }

                    await _estateRepository.Remove(estate);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation($"Se eliminó correctamente la propiedad Id:{id}.");
                    _response.StatusCode = HttpStatusCode.NoContent;
                    return Ok(_response);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex.ToString());
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.InternalServerError;
                    _response.ErrorMessages = new List<string> { ex.ToString() };
                    return BadRequest(_response);
                }
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] EstateCreateDTO estateCreateDto)
        {
            try
            {
                if (id <= 0)
                {
                    _logger.LogError($"Datos de entrada inválidos.");
                    _response.ErrorMessages = new List<string> { $"Datos de entrada inválidos." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(_response);
                }

                // 1..n
                var includes = new List<IncludePropertyConfiguration<Estate>>
            {
                 new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.CityDS
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListReports
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListJobs
                    },
                    new IncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.ListRents
                    }
                };

                var estate = await _estateRepository.Get(v => v.Id == id, includes: includes);
                if (estate == null)
                {
                    _logger.LogError($"Propiedad no encontrada ID = {id}.");
                    _response.ErrorMessages = new List<string> { $"Propiedad no encontrada ID = {id}" };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }

                // estate = _mapper.Map(estateCreateDto, estate);

                // No usar AutoMapper para mapear todo el objeto, sino actualizar campo por campo
                estate.Name = estateCreateDto.Name;
                estate.Address = estateCreateDto.Address;
                estate.LatLong = estateCreateDto.LatLong;
                estate.GoogleMapsURL = estateCreateDto.GoogleMapsURL;
                estate.CityDS = await _dbContext.CityDS.FindAsync(estateCreateDto.CityDSId);
                estate.Comments = estateCreateDto.Comments;
                estate.Update = DateTime.Now;

                var updatedEstate = await _estateRepository.Update(estate);

                _logger.LogInformation($"Se actualizó correctamente la propiedad Id:{id}.");
                _response.Result = _mapper.Map<EstateDTO>(updatedEstate);
                _response.StatusCode = HttpStatusCode.OK;

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

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<EstatePatchDTO> patchDto)
        {
            return await Patch<Estate, EstatePatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateEstate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] EstateCreateDTO estateCreateDto)
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
                if (await _estateRepository.Get(v => v.Name.ToLower() == estateCreateDto.Name.ToLower()) != null)
                {
                    _logger.LogError($"El nombre {estateCreateDto.Name} ya existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"El nombre {estateCreateDto.Name} ya existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"El nombre {estateCreateDto.Name} ya existe en el sistema.");
                    return BadRequest(ModelState);
                }

                var city = await _dbContext.CityDS.FindAsync(estateCreateDto.CityDSId);
                if (city == null)
                {
                    _logger.LogError($"La ciudad ID={estateCreateDto.CityDSId} no existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"La ciudad ID={estateCreateDto.CityDSId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"La ciudad ID={estateCreateDto.CityDSId} no existe en el sistema.");
                    return BadRequest(ModelState);
                }

                Estate modelo = _mapper.Map<Estate>(estateCreateDto);
                modelo.CityDS = city; // Asigna el objeto CountryDS resuelto
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                await _estateRepository.Create(modelo);
                _logger.LogInformation($"Se creó correctamente la propiedad Id:{modelo.Id}.");

                _response.Result = _mapper.Map<EstateDTO>(modelo);
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


