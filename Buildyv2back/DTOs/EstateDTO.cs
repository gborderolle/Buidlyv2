using Buildyv2.Models;

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

        public string City { get; set; }

        public string Province { get; set; }

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
