using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IOwnerRepository : IRepository<Owner>
    {
        Task<Owner> Update(Owner entity);
        IQueryable<Owner> GetAllQueryable();
    }
}

