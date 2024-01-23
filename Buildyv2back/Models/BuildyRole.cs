using Microsoft.AspNetCore.Identity;

namespace Buildyv2.Models
{
    public class BuildyRole : IdentityRole
    {
        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

    }
}
