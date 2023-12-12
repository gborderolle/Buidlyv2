using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class CityDSRepository : Repository<CityDS>, ICityDSRepository
    {
        private readonly DbContext _dbContext;

        public CityDSRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CityDS> Update(CityDS entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<CityDS> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}