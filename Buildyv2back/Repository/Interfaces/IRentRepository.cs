using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IRentRepository : IRepository<Rent>
    {
        Task<Rent> Update(Rent entity);
        IQueryable<Rent> GetAllQueryable();
    }
}

