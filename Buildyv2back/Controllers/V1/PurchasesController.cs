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
    [Route("api/purchases")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class PurchasesController : CustomBaseController<Purchase> // Notice <Purchase> here
    {
        private readonly IPurchaseRepository _purchaseRepository; // Servicio que contiene la lógica principal de negocio para Purchases.

        public PurchasesController(ILogger<PurchasesController> logger, IMapper mapper, IPurchaseRepository purchaseRepository)
        : base(mapper, logger, purchaseRepository)
        {
            _response = new();
            _purchaseRepository = purchaseRepository;
        }

        #region Endpoints genéricos

        [HttpGet("GetPurchase")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<Purchase, PurchaseDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var purchases = await _purchaseRepository.GetAll();
            _response.Result = _mapper.Map<List<PurchaseDTO>>(purchases);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Purchases/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            return await Get<Purchase, PurchaseDTO>();
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<Purchase>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] PurchaseCreateDTO purchaseCreateDTO)
        {
            return await Put<PurchaseCreateDTO, PurchaseDTO, Purchase>(id, purchaseCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<PurchasePatchDTO> patchDto)
        {
            return await Patch<Purchase, PurchasePatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreatePurchase")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] PurchaseCreateDTO purchaseCreateDto)
        {
            return Ok();
        }

        #endregion

        #region Private methods

        #endregion

    }
}

