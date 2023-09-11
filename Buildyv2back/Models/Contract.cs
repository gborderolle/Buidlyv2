using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Models
{
    public class Contract : IId
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string? Comments { get; set; }

        // Uniques
       
        public decimal? MonthlyValue { get; set; }
        
        public string Duration { get; set; }

        public bool IsLUC { get; set; } = false;
        
        public DateTime? Datetime_init { get; set; }
        
        public DateTime? Datetime_end { get; set; }

        #endregion

        #region External

        public Rent Rent { get; set; }

        public Notary? Notary { get; set; }

        public Warrant? Warrant { get; set; }

        public List<Photo> ListPhotos { get; set; } = new ();

        #endregion

    }
}
