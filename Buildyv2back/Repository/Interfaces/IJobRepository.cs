using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IJobRepository : IRepository<Job>
    {
        Task<Job> Update(Job entity);
        IQueryable<Job> GetAllQueryable();
    }
}

