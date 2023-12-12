using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Buildyv2.DTOs;
using Buildyv2.Repository.Interfaces;
using Buildyv2.Utilities;
using Buildyv2.Context;

namespace Buildyv2.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ContextDB _dbContext;
        internal DbSet<T> dbSet;

        public Repository(ContextDB db)
        {
            _dbContext = db;
            this.dbSet = _dbContext.Set<T>();
        }

        public async Task Create(T entity)
        {
            await dbSet.AddAsync(entity);
            await Save();
        }

        public async Task<T> Get
            (
            Expression<Func<T, bool>>? where = null,
            IEnumerable<IncludePropertyConfiguration<T>> includes = null,
            IEnumerable<ThenIncludePropertyConfiguration<T>> thenIncludes = null,
            bool tracked = true)
        {
            IQueryable<T> query = dbSet;
            if (includes != null)
            {
                foreach (var includeConfig in includes)
                {
                    query = query
                        .Include(includeConfig.IncludeExpression);
                }
            }
            if (thenIncludes != null)
            {
                foreach (var thenIncludeConfig in thenIncludes)
                {
                    query = query
                        .Include(thenIncludeConfig.IncludeExpression)
                        .ThenInclude(thenIncludeConfig.ThenIncludeExpression);
                }
            }
            if (!tracked)
            {
                query = query.AsNoTracking();
            }
            if (where != null)
            {
                query = query.Where(where);
            }
            return await query.FirstOrDefaultAsync();
        }

        public async Task<List<T>> GetAll
        (
            Expression<Func<T, bool>>? where = null,
            Expression<Func<T, object>>? orderBy = null,
            IEnumerable<IncludePropertyConfiguration<T>> includes = null,
            IEnumerable<ThenIncludePropertyConfiguration<T>> thenIncludes = null,
            PaginationDTO paginationDTO = null,
            HttpContext httpContext = null,
            bool tracked = false,
            bool ascendingOrder = true
        )
        {
            IQueryable<T> query = dbSet;
            if (includes != null)
            {
                foreach (var includeConfig in includes)
                {
                    query = query
                        .Include(includeConfig.IncludeExpression);
                }
            }
            if (thenIncludes != null)
            {
                foreach (var thenIncludeConfig in thenIncludes)
                {
                    query = query
                        .Include(thenIncludeConfig.IncludeExpression)
                        .ThenInclude(thenIncludeConfig.ThenIncludeExpression);
                }
            }
            if (orderBy != null)
            {
                query = ascendingOrder ? query.OrderBy(orderBy) : query.OrderByDescending(orderBy);
            }
            if (where != null)
            {
                query = query.Where(where);
            }
            if (httpContext != null && paginationDTO != null)
            {
                await httpContext.InsertParamPaginationHeader(query);
                query = query.DoPagination(paginationDTO);
            }
            if (!tracked)
            {
                query = query.AsNoTracking();
            }
            return await query.ToListAsync();
        }

        public async Task<T> Update(T entity)
        {
            // Generic update logic here. You can override it in specific repositories if needed.
            _dbContext.Update(entity);
            await Save();
            return entity;
        }

        public async Task Remove(T entity)
        {
            dbSet.Remove(entity);
            await Save();
        }

        public async Task Save()
        {
            await _dbContext.SaveChangesAsync();
        }

    }
}

public class IncludePropertyConfiguration<T>
{
    public Expression<Func<T, object>> IncludeExpression { get; set; }
    public Expression<Func<object, object>> ThenIncludeExpression { get; set; }
}

public class ThenIncludePropertyConfiguration<T>
{
    public Expression<Func<T, object>> IncludeExpression { get; set; }
    public Expression<Func<object, object>> ThenIncludeExpression { get; set; }
}