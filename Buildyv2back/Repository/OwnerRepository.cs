using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class OwnerRepository : Repository<Owner>, IOwnerRepository
    {
        private readonly DbContext _dbContext;

        public OwnerRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Owner> Update(Owner entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Owner> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}