using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IEstateRepository : IRepository<Estate>
    {
        Task<Estate> Update(Estate entity);
        IQueryable<Estate> GetAllQueryable();
    }
}

