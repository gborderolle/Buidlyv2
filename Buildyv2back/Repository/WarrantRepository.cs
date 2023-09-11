using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class WarrantRepository : Repository<Warrant>, IWarrantRepository
    {
        private readonly DbContext _dbContext;

        public WarrantRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Warrant> Update(Warrant entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Warrant> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}