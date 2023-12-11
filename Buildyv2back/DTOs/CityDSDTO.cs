using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using WebAPI_tutorial_peliculas.Validations;
using Buildyv2.Models;

namespace Buildyv2.DTOs
{
    public class CityDSDTO
    {
        #region Internal

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Creation { get; set; } = DateTime.Now;
        public DateTime Update { get; set; } = DateTime.Now;

        #endregion

        #region External

        public int ProvinceDSId { get; set; }

        #endregion

    }
}
