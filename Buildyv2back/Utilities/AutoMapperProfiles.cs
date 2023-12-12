using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Buildyv2.DTOs;
using Buildyv2.Models;

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

            CreateMap<ProvinceDSCreateDTO, ProvinceDS>().ReverseMap();
            CreateMap<ProvinceDS, ProvinceDSDTO>().ReverseMap();

            CreateMap<CityDSCreateDTO, CityDS>().ReverseMap();
            CreateMap<CityDS, CityDSDTO>().ReverseMap();
        }
    }
}