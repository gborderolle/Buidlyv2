using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Models
{
    public class Photo : IId
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string? Comments { get; set; }

        // Uniques

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public string FileRelativePath { get; set; }

        public string? MimeType { get; set; }

        #endregion

        #region External

        public Contract? Contract { get; set; }

        public Report? Report { get; set; }

        #endregion
    }
}
