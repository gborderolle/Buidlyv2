﻿using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IReportRepository : IRepository<Report>
    {
        Task<Report> Update(Report entity);
        IQueryable<Report> GetAllQueryable();
    }
}

