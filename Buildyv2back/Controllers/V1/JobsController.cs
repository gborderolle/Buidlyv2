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
    [Route("api/jobs")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class JobsController : CustomBaseController<Job> // Notice <Job> here
    {
        private readonly IJobRepository _jobRepository; // Servicio que contiene la lógica principal de negocio para Jobs.
        private readonly IPhotoRepository _photoRepository; // Servicio que contiene la lógica principal de negocio para Reports.
        private readonly ContextDB _dbContext;
        private readonly IFileStorage _fileStorage;

        public JobsController(ILogger<JobsController> logger, IMapper mapper, IJobRepository jobRepository, IPhotoRepository photoRepository, IFileStorage fileStorage, ContextDB dbContext)
        : base(mapper, logger, jobRepository)
        {
            _response = new();
            _jobRepository = jobRepository;
            _photoRepository = photoRepository;
            _fileStorage = fileStorage;
            _dbContext = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetJob")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            var includes = new List<IncludePropertyConfiguration<Job>>
            {
                    new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.Estate
                    },
                new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.ListWorkers
                    },
                new IncludePropertyConfiguration<Job>
                    {
                        IncludeExpression = b => b.ListPhotos
                    },
                };
            return await Get<Job, JobDTO>(paginationDTO: paginationDTO, includes: includes);
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
        
        [HttpDelete("{id:int}", Name = "DeleteJob")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Delete([FromRoute] int id)
        {
            try
            {
                var job = await _jobRepository.Get(x => x.Id == id, tracked: true, includes: new List<IncludePropertyConfiguration<Job>>
        {
            new IncludePropertyConfiguration<Job>
            {
                IncludeExpression = j => j.ListPhotos
            }
        });

                if (job == null)
                {
                    _logger.LogError($"Obra no encontrada ID = {id}.");
                    _response.ErrorMessages = new List<string> { $"Obra no encontrada ID = {id}." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound($"Obra no encontrada ID = {id}.");
                }

                // Eliminar las fotos asociadas
                if (job.ListPhotos != null)
                {
                    foreach (var photo in job.ListPhotos)
                    {
                        var container = $"uploads/jobs/estate{job.EstateId}/{photo.Creation.ToString("yyyy_MM")}/job{job.Id}";
                        await _fileStorage.DeleteFile(photo.URL, container);
                        _dbContext.Photo.Remove(photo); // Asegúrate de que el contexto de la base de datos sea correcto
                    }
                }

                await _jobRepository.Remove(job);
                _logger.LogInformation($"Se eliminó correctamente la obra Id:{id}.");
                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return BadRequest(_response);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Put(int id, [FromBody] JobCreateDTO jobCreateDto)
        {
            try
            {
                if (id <= 0)
                {
                    _logger.LogError($"Datos de entrada inválidos.");
                    _response.ErrorMessages = new List<string> { $"Datos de entrada inválidos." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(_response);
                }

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

                var job = await _jobRepository.Get(v => v.Id == id, includes: includes);
                if (job == null)
                {
                    _logger.LogError($"Trabajo no encontrado ID = {id}.");
                    _response.ErrorMessages = new List<string> { $"Trabajo no encontrado ID = {id}" };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }

                // No usar AutoMapper para mapear todo el objeto, sino actualizar campo por campo
                job.Name = jobCreateDto.Name;
                job.Month = jobCreateDto.Month;
                job.LabourCost = jobCreateDto.LabourCost;
                job.Comments = jobCreateDto.Comments;
                job.Update = DateTime.Now;

                job.EstateId = jobCreateDto.EstateId;
                job.Estate = await _dbContext.Estate.FindAsync(jobCreateDto.EstateId);
                job.ListWorkers = jobCreateDto.ListWorkers;

                var updatedJob = await _jobRepository.Update(job);

                _logger.LogInformation($"Se actualizó correctamente La obra Id:{id}.");
                _response.Result = _mapper.Map<EstateDTO>(updatedJob);
                _response.StatusCode = HttpStatusCode.OK;

                return Ok(_response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return BadRequest(_response);
        }

        [HttpPatch("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Patch(int id, [FromBody] JsonPatchDocument<JobDTO> patchDto)
        {
            return await Patch<Job, JobDTO>(id, patchDto);
        }

        #endregion

        #region Endpoints específicos

        [HttpPost(Name = "CreateJob")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> Post([FromForm] JobCreateDTO jobCreateDto)
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
                    _logger.LogError($"La obra ID={jobCreateDto.EstateId} no existe en el sistema");
                    _response.ErrorMessages = new List<string> { $"La obra ID={jobCreateDto.EstateId} no existe en el sistema." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    ModelState.AddModelError("NameAlreadyExists", $"La obra ID={jobCreateDto.EstateId} no existe en el sistema.");
                    return BadRequest(ModelState);
                }

                Job modelo = _mapper.Map<Job>(jobCreateDto);
                modelo.Estate = await _dbContext.Estate.FindAsync(jobCreateDto.EstateId);
                modelo.Creation = DateTime.Now;
                modelo.Update = DateTime.Now;

                // Primero, agrega el trabajo sin los trabajadores
                _dbContext.Job.Add(modelo);
                await _dbContext.SaveChangesAsync(); // Guarda el trabajo en la base de datos

                // Luego, asocia los trabajadores al trabajo creado
                foreach (var workerDto in jobCreateDto.ListWorkers)
                {
                    var existingWorker = await _dbContext.Worker.FindAsync(workerDto.Id);
                    if (existingWorker != null)
                    {
                        modelo.ListWorkers.Add(existingWorker);
                    }
                }

                await _dbContext.SaveChangesAsync(); // Guarda los cambios con los trabajadores asociados
                _logger.LogInformation($"Se creó correctamente la obra Id:{modelo.Id}.");

                if (jobCreateDto.ListPhotos != null && jobCreateDto.ListPhotos.Count > 0)
                {
                    string dynamicContainer = $"uploads/jobs/estate{estate.Id}/{DateTime.Now:yyyy_MM}/job{modelo.Id}";
                    foreach (var photoForm in jobCreateDto.ListPhotos)
                    {
                        Photo newPhoto = new();
                        newPhoto.Job = modelo;

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