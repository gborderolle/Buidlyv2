using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IOwnerDSRepository : IRepository<OwnerDS>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<OwnerDS> Update(OwnerDS entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<OwnerDS> GetAllQueryable();
    }
}

