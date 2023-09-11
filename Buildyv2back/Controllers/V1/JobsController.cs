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
    [Route("api/jobs")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class JobsController : CustomBaseController<Job> // Notice <Job> here
    {
        private readonly IJobRepository _jobRepository; // Servicio que contiene la lógica principal de negocio para Jobs.

        public JobsController(ILogger<JobsController> logger, IMapper mapper, IJobRepository jobRepository)
        : base(mapper, logger, jobRepository)
        {
            _response = new();
            _jobRepository = jobRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetJob")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Job, JobDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var jobs = await _jobRepository.GetAll();
            _response.Result = _mapper.Map<List<JobDTO>>(jobs);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Jobs/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            // 1..n
            var includes = new List<IncludePropertyConfiguration<Job>>
            {
                    new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.ListReports
                    },
                    new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.ListWorkers
                    },
                    new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.ListPurchases
                    }
                };
            return await Get<Job, JobDTO>(includes: includes);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Job>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] JobCreateDTO jobCreateDTO)
        {
            return await Put<JobCreateDTO, JobDTO, Job>(id, jobCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<JobPatchDTO> patchDto)
        {
            return await Patch<Job, JobPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateJob")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] JobCreateDTO jobCreateDto)
        {
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}

