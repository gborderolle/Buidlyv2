using AutoMapper;
using Azure;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Utilities;
using Buildyv2.Repository;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/cities")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CitiesController : CustomBaseController<CityDS> // Notice <CityDS> here
    {
        private readonly ICityDSRepository _cityRepository; // Servicio que contiene la lógica principal de negocio para Cities.
        private readonly ContextDB _dbContext;

        public CitiesController(ILogger<CitiesController> logger, IMapper mapper, ICityDSRepository workerRepository, ContextDB dbContext)
        : base(mapper, logger, workerRepository)
        {
            _response = new();
            _cityRepository = workerRepository;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetCity")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            return await Get<CityDS, CityDSDTO>(paginationDTO: paginationDTO);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<APIResponse>> All()
        {
            var workers = await _cityRepository.GetAll();
            _response.Result = _mapper.Map<List<CityDSDTO>>(workers);
            _response.StatusCode = HttpStatusCode.OK;
            return _response;
        }

        [HttpGet("{id:int}")] // url completa: https://localhost:7003/api/Cities/1
        public async Task<ActionResult<APIResponse>> Get([FromRoute] int id)
        {
            return await Get<CityDS, CityDSDTO>();
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            return await Delete<CityDS>(id);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] CityDSCreateDTO workerCreateDTO)
        {
            return await Put<CityDSCreateDTO, CityDSDTO, CityDS>(id, workerCreateDTO);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<CityDSPatchDTO> patchDto)
        {
            return await Patch<CityDS, CityDSPatchDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateCity")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromBody] CityDSCreateDTO cityCreateDto)
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
                if (await _cityRepository.Get(v => v.Name.ToLower() == cityCreateDto.Name.ToLower()) != null)
                {
                    _logger.LogError($"El nombre {cityCreateDto.Name} ya existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"El nombre {cityCreateDto.Name} ya existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"El nombre {cityCreateDto.Name} ya existe en el sistema.");
                    return BadRequest(ModelState);
                }


                var province = await _dbContext.ProvinceDS.FindAsync(cityCreateDto.ProvinceDSId);
                if (province == null)
                {
                    _logger.LogError($"El departamento ID={cityCreateDto.ProvinceDSId} no existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"El departamento ID={cityCreateDto.ProvinceDSId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"El departamento ID={cityCreateDto.ProvinceDSId} no existe en el sistema.");
                    return BadRequest(ModelState);
                }

                CityDS modelo = _mapper.Map<CityDS>(cityCreateDto);
                modelo.ProvinceDS = province; // Asigna el objeto CountryDS resuelto
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                await _cityRepository.Create(modelo);
                _logger.LogInformation($"Se creó correctamente la propiedad Id:{modelo.Id}.");

                _response.Result = _mapper.Map<CityDSDTO>(modelo);
                _response.StatusCode = HttpStatusCode.Created;

                // CreatedAtRoute -> Nombre de la ruta (del método): GetCityById
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

