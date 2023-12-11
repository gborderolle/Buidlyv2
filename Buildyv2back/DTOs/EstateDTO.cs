using Buildyv2.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using WebAPI_tutorial_peliculas.Validations;

namespace Buildyv2.DTOs
{
    public class EstateDTO
    {
        #region Internal

        public int Id { get; set; }

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


        #endregion

        #region External

        public List<Report> ListReports { get; set; } = new();

        public List<Job> ListJobs { get; set; } = new();

        public List<Rent> ListRents { get; set; } = new();

        public int PresentRentId { get; set; } = new();

        #endregion
    }
}
