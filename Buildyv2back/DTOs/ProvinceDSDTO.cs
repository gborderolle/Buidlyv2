namespace Buildyv2.DTOs
{
    public class ProvinceDSDTO
    {
        #region Internal

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Creation { get; set; } = DateTime.Now;
        public DateTime Update { get; set; } = DateTime.Now;

        #endregion

        #region External

        #endregion

    }
}
