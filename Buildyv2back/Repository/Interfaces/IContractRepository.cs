using Buildyv2.Models;
using WebAPI_tutorial_peliculas.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IContractRepository : IRepository<Contract>
    {
        Task<Contract> Update(Contract entity);
        IQueryable<Contract> GetAllQueryable();
    }
}

