﻿using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IProvinceDSRepository : IRepository<ProvinceDS>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<ProvinceDS> Update(ProvinceDS entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<ProvinceDS> GetAllQueryable();
    }
}

