using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IJobRepository : IRepository<Job>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Job> Update(Job entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Job> GetAllQueryable();
    }
}

