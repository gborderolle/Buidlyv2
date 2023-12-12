using System.Linq.Expressions;
using Buildyv2.DTOs;

namespace Buildyv2.Repository.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task Create(T entity);

        Task<List<T>> GetAll
            (
                Expression<Func<T, bool>>? where = null,
                Expression<Func<T, object>>? orderBy = null,
                IEnumerable<IncludePropertyConfiguration<T>> includes = null,
                IEnumerable<ThenIncludePropertyConfiguration<T>> thenIncludes = null,
                PaginationDTO paginationDTO = null, HttpContext httpContext = null,
                bool tracked = false,
                bool ascendingOrder = true
            );

        Task<T> Get
            (
                Expression<Func<T, bool>>? filter = null,
                IEnumerable<IncludePropertyConfiguration<T>> includes = null,
                IEnumerable<ThenIncludePropertyConfiguration<T>> thenIncludes = null,
                bool tracked = true
            );

        Task<T> Update(T entity);

        Task Remove(T entity);

        Task Save();
    }
}