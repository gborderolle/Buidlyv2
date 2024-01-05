using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IEstateRepository : IRepository<Estate>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Estate> Update(Estate entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Estate> GetAllQueryable();
    }
}

