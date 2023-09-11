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

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Estates/1
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
                        IncludeExpression = b => b.ListRentsHistory
                    }
                };
            // n..n
            var thenIncludes = new List<ThenIncludePropertyConfiguration<Estate>>
            {
                    new ThenIncludePropertyConfiguration<Estate>
                    {
                        IncludeExpression = b => b.OwnerEstateList,
                        ThenIncludeExpression = ab => ((OwnerEstate)ab).Owner
                    }
                };
            return await Get<Estate, EstateDTO>(includes: includes, thenIncludes: thenIncludes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Estate>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] EstateCreateDTO estateCreateDTO)
        {
            return await Put<EstateCreateDTO, EstateDTO, Estate>(id, estateCreateDTO);
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
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}


