using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface ICityDSRepository : IRepository<CityDS>
    {
        Task<CityDS> Update(CityDS entity);
        IQueryable<CityDS> GetAllQueryable();
    }
}

