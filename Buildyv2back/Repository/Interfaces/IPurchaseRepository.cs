using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IPurchaseRepository : IRepository<Purchase>
    {
        Task<Purchase> Update(Purchase entity);
        IQueryable<Purchase> GetAllQueryable();
    }
}

