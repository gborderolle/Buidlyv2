using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface ICityDSRepository : IRepository<CityDS>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<CityDS> Update(CityDS entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<CityDS> GetAllQueryable();
    }
}

