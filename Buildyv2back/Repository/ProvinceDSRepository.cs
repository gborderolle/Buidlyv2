using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class ProvinceDSRepository : Repository<ProvinceDS>, IProvinceDSRepository
    {
        private readonly DbContext _dbContext;

        public ProvinceDSRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public async Task<ProvinceDS> Update(ProvinceDS entity)
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<ProvinceDS> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}