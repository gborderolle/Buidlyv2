using Buildyv2.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Buildyv2.Validations;

namespace Buildyv2.DTOs
{
    public class RentCreateDTO
    {
        #region Internal

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Creation { get; set; } = DateTime.Now;

        public DateTime Update { get; set; } = DateTime.Now;

        public string Comments { get; set; }

        // Uniques

        public string Warrant { get; set; }

        public decimal? MonthlyValue { get; set; }

        public DateTime? Datetime_monthInit { get; set; }

        public string Duration { get; set; }

        public bool RentIsEnded { get; set; }

        //public List<Photo> ListPhotos { get; set; }
        [FileSizeValidation(maxSizeMB: 4)]
        [FileTypeValidation(fileTypeGroup: FileTypeGroup.Image)]
        public List<IFormFile> ListPhotos { get; set; } // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/19983788#notes

        #endregion

        #region External

        /// <summary>
        /// No uso Entidad para no generar dependencia circular
        /// </summary>
        [Required(ErrorMessage = "El campo {0} es requerido")] // n..0 (0=no existe este sin el padre)
        public int EstateId { get; set; }
        public Estate Estate { get; set; }

        public List<TenantCreateDTO> ListTenants { get; set; } = new();

        public int PrimaryTenantId { get; set; }

        #endregion
    }
}
