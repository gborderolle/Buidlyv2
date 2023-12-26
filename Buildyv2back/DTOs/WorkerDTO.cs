using Buildyv2.Models;
using Buildyv2.Validations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.DTOs
{
    public class WorkerDTO
    {
        #region Internal

        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string Phone { get; set; }

        public string Email { get; set; }

        public string IdentityDocument { get; set; }

        public string Comments { get; set; }

        #endregion

        #region External

        public int? JobId { get; set; } // n..1 (1=sí existe este sin el padre)

        #endregion
    }
}
