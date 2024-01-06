using AutoMapper;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Microsoft.AspNetCore.Identity;

namespace Buildyv2.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        private readonly IWebHostEnvironment _env;

        public AutoMapperProfiles(IWebHostEnvironment env)
        {
            _env = env;

            CreateMap<IdentityUser, UserDTO>();

            CreateMap<Estate, EstateDTO>()
              .ForMember(dest => dest.CityDS, opt => opt.MapFrom(src => src.CityDS))
              .ForMember(dest => dest.ListReports, opt => opt.MapFrom(src => src.ListReports))
              .ForMember(dest => dest.ListJobs, opt => opt.MapFrom(src => src.ListJobs))
              .ForMember(dest => dest.ListRents, opt => opt.MapFrom(src => src.ListRents))
              .ReverseMap();
            CreateMap<EstateCreateDTO, Estate>()
              .ForMember(dest => dest.CityDS, opt => opt.Ignore()) // Ignorar este campo
              .ReverseMap();

            CreateMap<WorkerCreateDTO, Worker>()
              .ForMember(dest => dest.JobId, opt => opt.MapFrom(src => src.JobId.HasValue ? src.JobId.Value : (int?)null))
              .ReverseMap();
            CreateMap<Worker, WorkerDTO>().ReverseMap();

            CreateMap<TenantCreateDTO, Tenant>().ReverseMap();
            CreateMap<Tenant, TenantDTO>().ReverseMap();

            CreateMap<CountryDS, CountryDSDTO>().ReverseMap();
            CreateMap<CountryDSCreateDTO, CountryDS>().ReverseMap();

            CreateMap<ProvinceDS, ProvinceDSDTO>()
              .ForMember(dest => dest.CountryDSId,
                opt => opt.MapFrom(src => src.CountryDS.Id))
              .ReverseMap();
            CreateMap<ProvinceDSCreateDTO, ProvinceDS>()
              .ForMember(dest => dest.CountryDS, opt => opt.Ignore()) // Ignorar este campo
              .ReverseMap();

            CreateMap<CityDS, CityDSDTO>()
              .ForMember(dest => dest.ProvinceDSId,
                opt => opt.MapFrom(src => src.ProvinceDS.Id))
              .ReverseMap();
            CreateMap<CityDSCreateDTO, CityDS>()
              .ForMember(dest => dest.ProvinceDS, opt => opt.Ignore()) // Ignorar este campo
              .ReverseMap();

            CreateMap<Report, ReportDTO>().ReverseMap();
            CreateMap<ReportCreateDTO, Report>()
              .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorar Id ya que es generado por la base de datos
              .ForMember(dest => dest.ListPhotos, opt => opt.MapFrom(src => MapIFormFilesToPhotos(src.ListPhotos, src.Id, src.Creation)))
              .ReverseMap();

            CreateMap<JobCreateDTO, Job>()
              .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorar Id ya que es generado por la base de datos
              .ReverseMap();
            CreateMap<Job, JobDTO>().ReverseMap();

        }

        private List<Photo> MapIFormFilesToPhotos(List<IFormFile> files, int reportId, DateTime creationDate)
        {
            var photos = new List<Photo>();
            int count = 1;
            foreach (var file in files)
            {
                var photo = new Photo
                {
                    URL = SaveFileAndGetUrl(file, reportId, creationDate, count)
                };
                photos.Add(photo);
                count++;
            }
            return photos;
        }

        private string SaveFileAndGetUrl(IFormFile file, int reportId, DateTime creationDate, int fileCount)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("El archivo proporcionado es inválido.");
            }

            // Construye la ruta base usando el ReportId y la fecha de creación.
            string basePath = Path.Combine(_env.WebRootPath, "/wwwroot/uploads/reports", reportId.ToString(), creationDate.ToString("yyyyMMddHHmmss"));

            // Asegúrate de que la carpeta exista.
            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

            // Construye un nombre de archivo que incluya el contador de archivos.
            string fileName = fileCount.ToString() + "_" + file.FileName;

            // Combina el nombre del archivo con la ruta del directorio.
            string filePath = Path.Combine(basePath, fileName);

            // Guarda el archivo en el sistema de archivos.
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }

            // Retorna la ruta donde el archivo fue guardado.
            return filePath;
        }

    }
}