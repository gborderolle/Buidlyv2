using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class TenantRepository : Repository<Tenant>, ITenantRepository
    {
        private readonly DbContext _dbContext;

        public TenantRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Tenant> Update(Tenant entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Tenant> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}