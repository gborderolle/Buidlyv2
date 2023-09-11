using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.Repository;

namespace Buildyv2.Repository
{
    public class NotaryRepository : Repository<Notary>, INotaryRepository
    {
        private readonly DbContext _dbContext;

        public NotaryRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Notary> Update(Notary entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Notary> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}