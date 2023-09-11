using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebAPI_tutorial_peliculas.Validations;

namespace Buildyv2.Models
{
    public class Warrant : IId
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(maximumLength: 100, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres")]
        [FirstCharCapitalValidation]
        public string Name { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string Comments { get; set; }

        public string Type { get; set; }

        #endregion

        #region External

        [Required(ErrorMessage = "El campo {0} es requerido")] // n..0 (0=no existe este sin el padre)
        public int ContractId { get; set; }
        public Contract Contract { get; set; }

        #endregion
    }
}
