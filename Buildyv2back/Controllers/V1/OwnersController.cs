using AutoMapper;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebAPI_tutorial_peliculas.DTOs;
using WebAPI_tutorial_peliculas.Models;
using WebAPI_tutorial_peliculas.Utilities;

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/owners")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class OwnersController : CustomBaseController<Owner> // Notice <Owner> here
    {
        private readonly IOwnerRepository _ownerRepository; // Servicio que contiene la lógica principal de negocio para Owners.

        public OwnersController(ILogger<OwnersController> logger, IMapper mapper, IOwnerRepository ownerRepository)
        : base(mapper, logger, ownerRepository)
        {
            _response = new();
            _ownerRepository = ownerRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetOwner")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Owner, OwnerDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var owners = await _ownerRepository.GetAll();
            _response.Result = _mapper.Map<List<OwnerDTO>>(owners);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Owners/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            // n..n
            var thenIncludes = new List<ThenIncludePropertyConfiguration<Owner>>
            {
                    new ThenIncludePropertyConfiguration<Owner>
                    {
                        IncludeExpression = b => b.OwnerEstateList,
                        ThenIncludeExpression = ab => ((OwnerEstate)ab).Estate
                    }
                };
            return await Get<Owner, OwnerDTO>(thenIncludes: thenIncludes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Owner>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] OwnerCreateDTO ownerCreateDTO)
        {
            return await Put<OwnerCreateDTO, OwnerDTO, Owner>(id, ownerCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<OwnerPatchDTO> patchDto)
        {
            return await Patch<Owner, OwnerPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateOwner")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] OwnerCreateDTO ownerCreateDto)
        {
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}

