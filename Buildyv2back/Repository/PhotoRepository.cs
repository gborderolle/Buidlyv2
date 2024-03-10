using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Buildyv2.Context;
using Buildyv2.Repository;

namespace Buildyv2.Repository
{
    public class PhotoRepository : Repository<Photo>, IPhotoRepository
    {
        private readonly DbContext _dbContext;

        public PhotoRepository(ContextDB dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public async Task<Photo> Update(Photo entity)
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        {
            entity.Update = DateTime.Now;
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public IQueryable<Photo> GetAllQueryable()
        {
            return dbSet.AsQueryable();
        }

        public async Task<List<Photo>> FindPhotosByJobId(int jobId)
        {
            return await _dbContext.Set<Photo>() // Use Set<Worker>() instead of Workers
                                   .Where(photo => photo.JobId == jobId)
                                   .ToListAsync();
        }

        public async Task<List<Photo>> FindPhotosByReportId(int reportId)
        {
            return await _dbContext.Set<Photo>() // Use Set<Worker>() instead of Workers
                                   .Where(photo => photo.ReportId == reportId)
                                   .ToListAsync();
        }

    }
}