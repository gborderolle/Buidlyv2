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
    [Route("api/contracts")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ContractsController : CustomBaseController<Contract> // Notice <Contract> here
    {
        private readonly IContractRepository _contractRepository; // Servicio que contiene la lógica principal de negocio para Contracts.

        public ContractsController(ILogger<ContractsController> logger, IMapper mapper, IContractRepository contractRepository)
        : base(mapper, logger, contractRepository)
        {
            _response = new();
            _contractRepository = contractRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetContract")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Contract, ContractDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var contracts = await _contractRepository.GetAll();
            _response.Result = _mapper.Map<List<ContractDTO>>(contracts);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Contracts/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            return await GetById<Contract, ContractDTO>(id);
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Contract>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] ContractCreateDTO contractCreateDTO)
        {
            return await Put<ContractCreateDTO, ContractDTO, Contract>(id, contractCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<ContractPatchDTO> patchDto)
        {
            return await Patch<Contract, ContractPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost("CreateContract")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] ContractCreateDTO contractCreateDto)
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

