using Buildyv2.Models;
using Buildyv2.Repository.Interfaces;

namespace Buildyv2.Repository.Interfaces
{
    public interface IReportRepository : IRepository<Report>
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        Task<Report> Update(Report entity);
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        IQueryable<Report> GetAllQueryable();
    }
}

