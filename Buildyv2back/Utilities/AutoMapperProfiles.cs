using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Buildyv2.DTOs;

namespace WebAPI_tutorial_peliculas.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<IdentityUser, UserDTO>();
        }

    }
}