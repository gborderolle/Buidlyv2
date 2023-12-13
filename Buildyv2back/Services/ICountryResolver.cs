using Buildyv2.Context;
using Buildyv2.Models;

namespace Buildyv2.Services
{
    public interface ICountryResolver
    {
        CountryDS ResolveCountry(int countryDSId);
    }

    public class CountryResolver : ICountryResolver
    {
        private readonly ContextDB _context;

        public CountryResolver(ContextDB context)
        {
            _context = context;
        }

        public CountryDS ResolveCountry(int countryDSId)
        {
            return _context.CountryDS.FirstOrDefault(c => c.Id == countryDSId);
        }
    }

}
