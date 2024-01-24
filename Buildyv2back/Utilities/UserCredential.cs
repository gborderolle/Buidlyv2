using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Utilities
{
    public class UserCredential
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
