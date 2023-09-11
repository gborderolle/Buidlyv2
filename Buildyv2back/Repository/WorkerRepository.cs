using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class WorkerRepository : Repository<Worker>, IWorkerRepository
    {
        private readonly DbContext _dbContext;

        public WorkerRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Worker> Update(Worker entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Worker> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}