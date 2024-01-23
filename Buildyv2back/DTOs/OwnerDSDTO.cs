namespace Buildyv2.DTOs
{
    public class OwnerDSDTO
    {
        #region Internal

        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public DateTime Creation { get; set; } = DateTime.Now;
        public DateTime Update { get; set; } = DateTime.Now;
        public string NominatimCityCode { get; set; }

        #endregion

        #region External

        #endregion
    }
}
