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
    [Route("api/warrants")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class WarrantsController : CustomBaseController<Warrant> // Notice <Warrant> here
    {
        private readonly IWarrantRepository _warrantRepository; // Servicio que contiene la lógica principal de negocio para Warrants.

        public WarrantsController(ILogger<WarrantsController> logger, IMapper mapper, IWarrantRepository warrantRepository)
        : base(mapper, logger, warrantRepository)
        {
            _response = new();
            _warrantRepository = warrantRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetWarrant")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Warrant, WarrantDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var warrants = await _warrantRepository.GetAll();
            _response.Result = _mapper.Map<List<WarrantDTO>>(warrants);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Warrants/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            return await Get<Warrant, WarrantDTO>();
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Warrant>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] WarrantCreateDTO warrantCreateDTO)
        {
            return await Put<WarrantCreateDTO, WarrantDTO, Warrant>(id, warrantCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<WarrantPatchDTO> patchDto)
        {
            return await Patch<Warrant, WarrantPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateWarrant")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] WarrantCreateDTO warrantCreateDto)
        {
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}

