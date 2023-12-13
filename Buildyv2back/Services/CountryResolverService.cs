using AutoMapper;
using Buildyv2.DTOs;
using Buildyv2.Models;

namespace Buildyv2.Services
{
    public class CountryResolverService : IValueResolver<ProvinceDSCreateDTO, ProvinceDS, CountryDS>
    {
        private readonly ICountryResolver _countryResolver;

        public CountryResolverService(ICountryResolver countryResolver)
        {
            _countryResolver = countryResolver;
        }

        public CountryDS Resolve(ProvinceDSCreateDTO source, ProvinceDS destination, CountryDS destMember, ResolutionContext context)
        {
            return _countryResolver.ResolveCountry(source.CountryDSId);
        }
    }
}
