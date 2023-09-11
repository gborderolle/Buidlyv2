using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Models
{
    public class Purchase : IId
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(maximumLength: 100, ErrorMessage = "El campo {0} no puede tener más de {1} caracteres")]
        public string Name { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string? Comments { get; set; }

        // Uniques

        public int Amount { get; set; }

        public string Supplier { get; set; }

        public decimal TotalCost { get; set; }

        public DateTime Datetime_purchase { get; set; }

        #endregion

        #region External

        public Job Job { get; set; }

        #endregion
    }
}
