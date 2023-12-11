using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebAPI_tutorial_peliculas.Validations;

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
        [FirstCharCapitalValidation]
        public string Name { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string Comments { get; set; }

        // Uniques

        public string Address { get; set; }

        [FirstCharCapitalValidation]
        public string City { get; set; }

        [FirstCharCapitalValidation]
        public string Province { get; set; }

        [FirstCharCapitalValidation]
        public string Country { get; set; }

        public string GoogleMapsURL { get; set; }

        public bool EstateIsRented { get; set; }

        public string LatLong { get; set; }

        #endregion

        #region External

        public List<Report> ListReports { get; set; } = new();

        public List<Job> ListJobs { get; set; } = new();

        public List<Rent> ListRents { get; set; } = new();
        
        public int PresentRentId { get; set; } = new();

        #endregion
    }
}
