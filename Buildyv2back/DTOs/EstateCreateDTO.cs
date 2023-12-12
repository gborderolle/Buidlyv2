using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Buildyv2.Validations;

namespace Buildyv2.DTOs
{
    public class EstateCreateDTO
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(maximumLength: 100, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres")]
        [FirstCharCapitalValidation]
        public string Name { get; set; }

        public string Address { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string City { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string Province { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string Country { get; set; }
        public string GoogleMapsURL { get; set; }
        public bool EstateIsRented { get; set; }
        public string Comments { get; set; }
        public int PresentRentId { get; set; }
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string LatLong { get; set; }

        #endregion

        #region External

        #endregion
    }
}
