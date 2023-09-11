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
    [Route("api/workers")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class WorkersController : CustomBaseController<Worker> // Notice <Worker> here
    {
        private readonly IWorkerRepository _workerRepository; // Servicio que contiene la lógica principal de negocio para Workers.

        public WorkersController(ILogger<WorkersController> logger, IMapper mapper, IWorkerRepository workerRepository)
        : base(mapper, logger, workerRepository)
        {
            _response = new();
            _workerRepository = workerRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetWorker")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Worker, WorkerDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var workers = await _workerRepository.GetAll();
            _response.Result = _mapper.Map<List<WorkerDTO>>(workers);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Workers/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            return await Get<Worker, WorkerDTO>();
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Worker>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] WorkerCreateDTO workerCreateDTO)
        {
            return await Put<WorkerCreateDTO, WorkerDTO, Worker>(id, workerCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<WorkerPatchDTO> patchDto)
        {
            return await Patch<Worker, WorkerPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateWorker")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] WorkerCreateDTO workerCreateDto)
        {
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}

