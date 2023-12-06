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
    [Route("api/reports")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReportsController : CustomBaseController<Report> // Notice <Report> here
    {
        private readonly IReportRepository _reportRepository; // Servicio que contiene la lógica principal de negocio para Reports.

        public ReportsController(ILogger<ReportsController> logger, IMapper mapper, IReportRepository reportRepository)
        : base(mapper, logger, reportRepository)
        {
            _response = new();
            _reportRepository = reportRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetReport")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Report, ReportDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var reports = await _reportRepository.GetAll();
            _response.Result = _mapper.Map<List<ReportDTO>>(reports);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Reports/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            // 1..n
            var includes = new List<IncludePropertyConfiguration<Report>>
            {
                    new IncludePropertyConfiguration<Report>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
                };
            return await Get<Report, ReportDTO>(includes: includes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Report>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] ReportCreateDTO reportCreateDTO)
        {
            return await Put<ReportCreateDTO, ReportDTO, Report>(id, reportCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<ReportPatchDTO> patchDto)
        {
            return await Patch<Report, ReportPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateReport")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] ReportCreateDTO reportCreateDto)
        {
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}