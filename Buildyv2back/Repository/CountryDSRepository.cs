using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class CountryDSRepository : Repository<CountryDS>, ICountryDSRepository
    {
        private readonly DbContext _dbContext;

        public CountryDSRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public async Task<CountryDS> Update(CountryDS entity)
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<CountryDS> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}