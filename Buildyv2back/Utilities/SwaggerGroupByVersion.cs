using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace Buildyv2.Utilities
{
    public class SwaggerGroupByVersion : IControllerModelConvention
    {
        public void Apply(ControllerModel controller)
        {
            var controllerNamespace = controller.ControllerType.Namespace; // Controllers.V1
            var versionAPI = controllerNamespace.Split('.').Last().ToLower(); // v1
            controller.ApiExplorer.GroupName = versionAPI;
        }

    }
}