using WebAPI_tutorial_peliculas.DTOs;

namespace WebAPI_tutorial_peliculas.Utilities
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> DoPagination<T>(this IQueryable<T> queryable, PaginationDTO paginationDTO)
        {
            return queryable
                .Skip((paginationDTO.Page - 1) * paginationDTO.RecordsPerPage)
                .Take(paginationDTO.RecordsPerPage);
        }
    }
}
