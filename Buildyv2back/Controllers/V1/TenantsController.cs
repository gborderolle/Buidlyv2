﻿using AutoMapper;
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
    [Route("api/tenants")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class TenantsController : CustomBaseController<Tenant> // Notice <Tenant> here
    {
        private readonly ITenantRepository _tenantRepository; // Servicio que contiene la lógica principal de negocio para Tenants.
        private readonly ContextDB _dbContext;

        public TenantsController(ILogger<TenantsController> logger, IMapper mapper, ITenantRepository tenantRepository, ContextDB dbContext)
        : base(mapper, logger, tenantRepository)
        {
            _response = new();
            _tenantRepository = tenantRepository;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetTenant")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            var includes = new List<IncludePropertyConfiguration<Tenant>>
            {
                 new IncludePropertyConfiguration<Tenant>
                    {
                        IncludeExpression = b => b.Rent
                    },
                };

            return await Get<Tenant, TenantDTO>(paginationDTO: paginationDTO, includes: includes);
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

        [HttpGet("{id}", Name = "GetTenantById")] // url completa: https://localhost:7003/api/Estates/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            var includes = new List<IncludePropertyConfiguration<Tenant>>
            {
                 new IncludePropertyConfiguration<Tenant>
                    {
                        IncludeExpression = b => b.Rent
                    },
                };
            return await Get<Tenant, TenantDTO>(includes: includes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Tenant>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] TenantCreateDTO tenantCreateDto)
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
                var includes = new List<IncludePropertyConfiguration<Tenant>>
            {
                 new IncludePropertyConfiguration<Tenant>
                    {
                        IncludeExpression = b => b.Rent
                    },
                };

                var tenant = await _tenantRepository.Get(filter: v => v.Id == id, includes: includes);
                if (tenant == null)
                {
                    _logger.LogError($"Trabajo no encontrado ID = {id}.");
                    _response.ErrorMessages = new List<string> { $"Trabajo no encontrado ID = {id}" };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }

                // No usar AutoMapper para mapear todo el objeto, sino actualizar campo por campo
                tenant.Name = tenantCreateDto.Name;
                tenant.Phone1 = tenantCreateDto.Phone1;
                tenant.Phone2 = tenantCreateDto.Phone2;
                tenant.Email = tenantCreateDto.Email;
                tenant.IdentityDocument = tenantCreateDto.IdentityDocument;
                tenant.Comments = tenantCreateDto.Comments;
                tenant.Update = DateTime.Now;

                tenant.RentId = tenantCreateDto.RentId;
                tenant.Rent = await _dbContext.Rent.FindAsync(tenantCreateDto.RentId);

                var updatedTenant = await _tenantRepository.Update(tenant);

                _logger.LogInformation($"Se actualizó correctamente el inquilino Id:{id}.");
                _response.Result = _mapper.Map<EstateDTO>(updatedTenant);
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
                _logger.LogInformation($"Se creó correctamente el inquilino Id:{modelo.Id}.");

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

