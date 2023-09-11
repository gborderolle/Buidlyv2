using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface INotaryRepository : IRepository<Notary>
    {
        Task<Notary> Update(Notary entity);
        IQueryable<Notary> GetAllQueryable();
    }
}

