﻿using AutoMapper;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Microsoft.AspNetCore.Identity;

namespace Buildyv2.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
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

            CreateMap<ReportCreateDTO, Report>()
    .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorar Id ya que es generado por la base de datos
    .ReverseMap();
            CreateMap<Report, ReportDTO>().ReverseMap();

            CreateMap<JobCreateDTO, Job>()
    .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorar Id ya que es generado por la base de datos
    .ReverseMap();
            CreateMap<Job, JobDTO>().ReverseMap();

        }
    }
}