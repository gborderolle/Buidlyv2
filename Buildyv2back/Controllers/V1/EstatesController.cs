using AutoMapper;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Utilities;

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/estates")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class EstatesController : CustomBaseController<Estate> // Notice <Estate> here
    {
        private readonly IEstateRepository _estateRepository; // Servicio que contiene la lógica principal de negocio para Estates.

        public EstatesController(ILogger<EstatesController> logger, IMapper mapper, IEstateRepository estateRepository)
        : base(mapper, logger, estateRepository)
        {
            _response = new();
            _estateRepository = estateRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetEstate")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Estate, EstateDTO>(paginationDTO: paginationDTO);
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
            return await Get<Estate, EstateDTO>(includes: includes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Estate>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] EstateCreateDTO estateCreateDto)
        {
            return await Put<EstateCreateDTO, EstateDTO, Estate>(id, estateCreateDto);
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

                Estate modelo = _mapper.Map<Estate>(estateCreateDto);
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


