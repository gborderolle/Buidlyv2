using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IProvinceDSRepository : IRepository<ProvinceDS>
    {
        Task<ProvinceDS> Update(ProvinceDS entity);
        IQueryable<ProvinceDS> GetAllQueryable();
    }
}

