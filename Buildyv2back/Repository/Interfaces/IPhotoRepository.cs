﻿using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IPhotoRepository : IRepository<Photo>
    {
        Task<Photo> Update(Photo entity);
        IQueryable<Photo> GetAllQueryable();
    }
}
