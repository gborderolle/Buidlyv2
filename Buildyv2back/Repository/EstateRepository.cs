using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class EstateRepository : Repository<Estate>, IEstateRepository
    {
        private readonly DbContext _dbContext;

        public EstateRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Estate> Update(Estate entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Estate> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}