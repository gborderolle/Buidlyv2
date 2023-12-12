using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class RentRepository : Repository<Rent>, IRentRepository
    {
        private readonly DbContext _dbContext;

        public RentRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Rent> Update(Rent entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Rent> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}