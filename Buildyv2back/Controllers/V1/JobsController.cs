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
    [Route("api/jobs")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class JobsController : CustomBaseController<Job> // Notice <Job> here
    {
        private readonly IJobRepository _jobRepository; // Servicio que contiene la lógica principal de negocio para Jobs.
        private readonly ContextDB _dbContext;

        public JobsController(ILogger<JobsController> logger, IMapper mapper, IJobRepository jobRepository, ContextDB dbContext)
        : base(mapper, logger, jobRepository)
        {
            _response = new();
            _jobRepository = jobRepository;
            _dbContext = dbContext;
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
                        IncludeExpression = b => b.ListWorkers
                    },
                new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
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
                if (await _jobRepository.Get(v => v.Name.ToLower() == jobCreateDto.Name.ToLower()) != null)
                {
                    _logger.LogError($"El nombre {jobCreateDto.Name} ya existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"El nombre {jobCreateDto.Name} ya existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"El nombre {jobCreateDto.Name} ya existe en el sistema.");
                    return BadRequest(ModelState);
                }

                var estate = await _dbContext.Estate.FindAsync(jobCreateDto.EstateId);
                if (estate == null)
                {
                    _logger.LogError($"La propiedad ID={jobCreateDto.EstateId} no existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"La propiedad ID={jobCreateDto.EstateId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"La propiedad ID={jobCreateDto.EstateId} no existe en el sistema.");
                    return BadRequest(ModelState);
                }

                Job modelo = _mapper.Map<Job>(jobCreateDto);
                modelo.Estate = estate; 
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                await _jobRepository.Create(modelo);
                _logger.LogInformation($"Se creó correctamente la obra Id:{modelo.Id}.");

                _response.Result = _mapper.Map<JobDTO>(modelo);
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