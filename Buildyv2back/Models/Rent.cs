using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Models
{
    public class Rent : IId
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string? Comments { get; set; }

        // Uniques

        public bool? RentIsEnded { get; set; }

        #endregion

        #region External
        
        /// <summary>
        /// No uso Entidad para no generar dependencia circular
        /// </summary>
        public int EstateId { get; set; }

        public Tenant Tenant { get; set; }

        public Contract Contract { get; set; }

        #endregion
    }
}
