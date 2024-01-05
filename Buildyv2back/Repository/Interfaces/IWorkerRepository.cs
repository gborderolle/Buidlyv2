using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IWorkerRepository : IRepository<Worker>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Worker> Update(Worker entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Worker> GetAllQueryable();
    }
}

