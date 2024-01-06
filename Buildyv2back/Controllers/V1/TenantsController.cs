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

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/tenants")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TenantsController : CustomBaseController<Tenant> // Notice <Tenant> here
    {
        private readonly ITenantRepository _tenantRepository; // Servicio que contiene la lógica principal de negocio para Tenants.

        public TenantsController(ILogger<TenantsController> logger, IMapper mapper, ITenantRepository tenantRepository)
        : base(mapper, logger, tenantRepository)
        {
            _response = new();
            _tenantRepository = tenantRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetTenant")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Tenant, TenantDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var tenants = await _tenantRepository.GetAll();
            _response.Result = _mapper.Map<List<TenantDTO>>(tenants);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Tenants/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            return await Get<Tenant, TenantDTO>();
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Tenant>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] TenantCreateDTO tenantCreateDTO)
        {
            return await Put<TenantCreateDTO, TenantDTO, Tenant>(id, tenantCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<TenantPatchDTO> patchDto)
        {
            return await Patch<Tenant, TenantPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateTenant")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] TenantCreateDTO tenantCreateDto)
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
                if (await _tenantRepository.Get(v => v.Name.ToLower() == tenantCreateDto.Name.ToLower()) != null)
                {
                    _logger.LogError($"El nombre {tenantCreateDto.Name} ya existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"El nombre {tenantCreateDto.Name} ya existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"El nombre {tenantCreateDto.Name} ya existe en el sistema.");
                    return BadRequest(ModelState);
                }

                Tenant modelo = _mapper.Map<Tenant>(tenantCreateDto);
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                await _tenantRepository.Create(modelo);
                _logger.LogInformation($"Se creó correctamente la propiedad Id:{modelo.Id}.");

                _response.Result = _mapper.Map<TenantDTO>(modelo);
                _response.StatusCode = HttpStatusCode.Created;

                // CreatedAtRoute -> Nombre de la ruta (del método): GetCountryDSById
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

