﻿using System.ComponentModel.DataAnnotations;

namespace WebAPI_tutorial_peliculas.Utilities
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
