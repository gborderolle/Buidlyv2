using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;

namespace Buildyv2.Repository
{
    public class OwnerDSRepository : Repository<OwnerDS>, IOwnerDSRepository
    {
        private readonly DbContext _dbContext;

        public OwnerDSRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public async Task<OwnerDS> Update(OwnerDS entity)
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<OwnerDS> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}