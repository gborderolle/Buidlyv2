using AutoMapper;
using Buildyv2.Context;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Buildyv2.Services;
using Buildyv2.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")]
    [Route("api/reports")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReportsController : CustomBaseController<Report> // Notice <Report> here
    {
        private readonly IReportRepository _reportRepository; // Servicio que contiene la lógica principal de negocio para Reports.
        private readonly IPhotoRepository _photoRepository; // Servicio que contiene la lógica principal de negocio para Reports.
        private readonly ContextDB _dbContext;
        private readonly IFileStorage _fileStorage;

        public ReportsController(ILogger<ReportsController> logger, IMapper mapper, IReportRepository reportRepository, IPhotoRepository photoRepository, IFileStorage fileStorage, ContextDB dbContext)
        : base(mapper, logger, reportRepository)
        {
            _response = new();
            _reportRepository = reportRepository;
            _photoRepository = photoRepository;
            _fileStorage = fileStorage;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetReport")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            var includes = new List<IncludePropertyConfiguration<Report>>
            {
                    new IncludePropertyConfiguration<Report>
                    {
                        IncludeExpression = b => b.Estate
                    },
                    new IncludePropertyConfiguration<Report>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
            };
            return await Get<Report, ReportDTO>(paginationDTO: paginationDTO, includes: includes);
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
                        IncludeExpression = b => b.Estate
                    },
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
        public async Task<ActionResult<APIResponse>> Post([FromForm] ReportCreateDTO reportCreateDto)
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
                if (await _reportRepository.Get(v => v.Name.ToLower() == reportCreateDto.Name.ToLower()) != null)
                {
                    _logger.LogError($"El nombre {reportCreateDto.Name} ya existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"El nombre {reportCreateDto.Name} ya existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"El nombre {reportCreateDto.Name} ya existe en el sistema.");
                    return BadRequest(ModelState);
                }

                var estate = await _dbContext.Estate.FindAsync(reportCreateDto.EstateId);
                if (estate == null)
                {
                    _logger.LogError($"La propiedad ID={reportCreateDto.EstateId} no existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"La propiedad ID={reportCreateDto.EstateId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"La propiedad ID={reportCreateDto.EstateId} no existe en el sistema.");
                    return BadRequest(ModelState);
                }

                Report modelo = _mapper.Map<Report>(reportCreateDto);
                modelo.Estate = estate;
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                await _reportRepository.Create(modelo);
                _logger.LogInformation($"Se creó correctamente el reporte Id:{modelo.Id}.");

                if (reportCreateDto.ListPhotos != null && reportCreateDto.ListPhotos.Count > 0)
                {
                    string dynamicContainer = $"uploads/reports/estate{estate.Id}/{DateTime.Now:yyyy_MM}/report{modelo.Id}";
                    foreach (var photoForm in reportCreateDto.ListPhotos)
                    {
                        Photo newPhoto = new();
                        newPhoto.Report = modelo;

                        using (var stream = new MemoryStream())
                        {
                            await photoForm.CopyToAsync(stream);
                            var content = stream.ToArray();
                            var extension = Path.GetExtension(photoForm.FileName);
                            newPhoto.URL = await _fileStorage.SaveFile(content, extension, dynamicContainer, photoForm.ContentType);
                        }

                        await _photoRepository.Create(newPhoto);
                    }
                }

                _response.Result = _mapper.Map<ReportDTO>(modelo);
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