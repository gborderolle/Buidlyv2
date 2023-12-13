using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Buildyv2.DTOs;
using Buildyv2.Models;
using Buildyv2.Services;

namespace Buildyv2.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<IdentityUser, UserDTO>();

            CreateMap<EstateCreateDTO, Estate>().ReverseMap();
            CreateMap<Estate, EstateDTO>().ReverseMap();

            CreateMap<CountryDSCreateDTO, CountryDS>().ReverseMap();
            CreateMap<CountryDS, CountryDSDTO>().ReverseMap();

            CreateMap<ProvinceDS, ProvinceDSDTO>().ReverseMap();
            CreateMap<ProvinceDSCreateDTO, ProvinceDS>()
                .ForMember(dest => dest.CountryDS, opt => opt.Ignore()) // Ignorar este campo
                .ReverseMap();

            CreateMap<CityDSCreateDTO, CityDS>().ReverseMap();
            CreateMap<CityDSCreateDTO, CityDS>()
    .ForMember(dest => dest.ProvinceDS, opt => opt.Ignore()) // Ignorar este campo
    .ReverseMap();

        }
    }
}