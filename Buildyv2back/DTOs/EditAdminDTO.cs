using System.ComponentModel.DataAnnotations;

namespace WebAPI_tutorial_peliculas.DTOs
{
    public class EditAdminDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}