using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Utilities
{
    public class UserCredential
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
