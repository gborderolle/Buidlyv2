using AutoMapper;
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
                .ForMember(dest => dest.CityDS,
                           opt => opt.MapFrom(src => src.CityDS.Id))
                .ReverseMap();
            CreateMap<EstateCreateDTO, Estate>()
                .ForMember(dest => dest.CityDS, opt => opt.Ignore()) // Ignorar este campo
                .ReverseMap();

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
        }
    }
}