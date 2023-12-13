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

            CreateMap<Estate, EstateDTO>().ReverseMap();
            CreateMap<EstateCreateDTO, Estate>().ReverseMap();

            CreateMap<CountryDS, CountryDSDTO>().ReverseMap();
            CreateMap<CountryDSCreateDTO, CountryDS>().ReverseMap();

            CreateMap<ProvinceDS, ProvinceDSDTO>().ReverseMap();
            CreateMap<ProvinceDSCreateDTO, ProvinceDS>()
                .ForMember(dest => dest.CountryDS, opt => opt.Ignore()) // Ignorar este campo
                .ReverseMap();

            CreateMap<CityDS, CityDSDTO>().ReverseMap();
            CreateMap<CityDSCreateDTO, CityDS>()
    .ForMember(dest => dest.ProvinceDS, opt => opt.Ignore()) // Ignorar este campo
    .ReverseMap();

        }
    }
}