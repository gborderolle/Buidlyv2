using System.ComponentModel.DataAnnotations;

namespace Buildyv2.DTOs
{
    public class EditAdminDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}