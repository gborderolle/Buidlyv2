using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IWarrantRepository : IRepository<Warrant>
    {
        Task<Warrant> Update(Warrant entity);
        IQueryable<Warrant> GetAllQueryable();
    }
}

