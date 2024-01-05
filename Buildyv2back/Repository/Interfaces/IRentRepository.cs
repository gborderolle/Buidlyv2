using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IRentRepository : IRepository<Rent>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Rent> Update(Rent entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Rent> GetAllQueryable();
    }
}

