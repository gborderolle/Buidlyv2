using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI_tutorial_peliculas.Services
{
    public class GenerateLinks
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IActionContextAccessor _actionContextAccessor;

        public GenerateLinks(IAuthorizationService authorizationService, IHttpContextAccessor httpContextAccessor, IActionContextAccessor actionContextAccessor)
        {
            _authorizationService = authorizationService;
            _httpContextAccessor = httpContextAccessor;
            _actionContextAccessor = actionContextAccessor;
        }

        private IUrlHelper SetupURLHelper()
        {
            var factory = _httpContextAccessor.HttpContext.RequestServices.GetRequiredService<IUrlHelperFactory>();
            return factory.GetUrlHelper(_actionContextAccessor.ActionContext);
        }

        private async Task<bool> IsAdmin()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var result = await _authorizationService.AuthorizeAsync(httpContext.User, "IsAdmin");
            return result.Succeeded;
        }

    }
}

