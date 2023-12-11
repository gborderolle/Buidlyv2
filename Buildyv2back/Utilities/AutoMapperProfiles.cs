using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Buildyv2.DTOs;
using Buildyv2.Models;

namespace WebAPI_tutorial_peliculas.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<IdentityUser, UserDTO>();

            CreateMap<EstateCreateDTO, Estate>().ReverseMap();
            CreateMap<Estate, EstateDTO>().ReverseMap();
        }

    }
}