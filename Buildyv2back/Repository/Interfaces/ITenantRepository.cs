using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface ITenantRepository : IRepository<Tenant>
    {
        Task<Tenant> Update(Tenant entity);
        IQueryable<Tenant> GetAllQueryable();
    }
}

