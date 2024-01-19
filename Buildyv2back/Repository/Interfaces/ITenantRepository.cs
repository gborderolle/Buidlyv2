using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface ITenantRepository : IRepository<Tenant>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Tenant> Update(Tenant entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Tenant> GetAllQueryable();
        Task<List<Tenant>> FindTenantsByRentId(int rentId);
    }
}

