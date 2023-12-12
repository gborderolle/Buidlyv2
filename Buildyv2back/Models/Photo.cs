using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Buildyv2.Validations;

namespace Buildyv2.Models
{
    public class Photo
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        // Uniques
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string URL { get; set; }

        #endregion

        #region External

        #endregion
    }
}
