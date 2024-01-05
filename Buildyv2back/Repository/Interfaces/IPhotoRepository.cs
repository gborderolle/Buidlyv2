using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IPhotoRepository : IRepository<Photo>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Photo> Update(Photo entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Photo> GetAllQueryable();
    }
}

