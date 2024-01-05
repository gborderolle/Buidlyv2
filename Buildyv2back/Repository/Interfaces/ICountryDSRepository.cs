using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface ICountryDSRepository : IRepository<CountryDS>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<CountryDS> Update(CountryDS entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<CountryDS> GetAllQueryable();
    }
}

