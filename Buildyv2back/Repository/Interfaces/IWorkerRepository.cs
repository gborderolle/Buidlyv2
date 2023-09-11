using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IWorkerRepository : IRepository<Worker>
    {
        Task<Worker> Update(Worker entity);
        IQueryable<Worker> GetAllQueryable();
    }
}

