using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Models
{
    public class Estate : IId
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

        public string Address { get; set; }
        
        public string City { get; set; }

        public string Province { get; set; }

        public string Country { get; set; }

        public string? GoogleMapsURL { get; set; }

        #endregion

        #region External

        public List<Report> ListReports { get; set; } = new();
        
        public List<Job> ListJobs { get; set; } = new();

        public Rent PresentRent { get; set; } = new();

        public List<Rent> ListRentsHistory { get; set; } = new();

        // N..N Owners --> OwnerEstate

        #endregion
    }
}
