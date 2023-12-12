using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface ICountryDSRepository : IRepository<CountryDS>
    {
        Task<CountryDS> Update(CountryDS entity);
        IQueryable<CountryDS> GetAllQueryable();
    }
}

