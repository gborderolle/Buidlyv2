using Buildyv2.Models;
using Buildyv2.Validations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.DTOs
{
    public class JobPatchDTO
    {
        #region Internal

        public int Id { get; set; }

        public string Name { get; set; }

        public string Month { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string Comments { get; set; }

        // Uniques

        public decimal LabourCost { get; set; }

        public List<Photo> ListPhotos { get; set; }

        #endregion

        #region External
        
        public int EstateId { get; set; }
        public Estate Estate { get; set; }

        public List<Worker> ListWorkers { get; set; } = new();

        #endregion
    }
}
