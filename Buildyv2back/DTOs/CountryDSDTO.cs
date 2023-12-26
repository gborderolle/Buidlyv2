﻿namespace Buildyv2.DTOs
{
    public class CountryDSDTO
    {
        #region Internal

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Creation { get; set; } = DateTime.Now;
        public DateTime Update { get; set; } = DateTime.Now;
        public string NominatimCountryCode { get; set; }

#endregion

        #region External

        #endregion

    }
}
