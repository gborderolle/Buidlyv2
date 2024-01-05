using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class EstateRepository : Repository<Estate>, IEstateRepository
    {
        private readonly DbContext _dbContext;

        public EstateRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public async Task<Estate> Update(Estate entity)
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
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