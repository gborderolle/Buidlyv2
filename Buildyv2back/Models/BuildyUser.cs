using Microsoft.AspNetCore.Identity;

namespace Buildyv2.Models
{
    public class BuildyUser : IdentityUser
    {
        public string Name { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

    }
}