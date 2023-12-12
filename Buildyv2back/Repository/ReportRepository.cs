using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class ReportRepository : Repository<Report>, IReportRepository
    {
        private readonly DbContext _dbContext;

        public ReportRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Report> Update(Report entity)
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Report> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

    }
}