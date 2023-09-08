using NodaTime;
using System.Globalization;
using System.Text;

namespace WebAPI_tutorial_peliculas.Utilities
{
    public static class GlobalServices
    {
        public static DateTime GetDatetimeUruguay()
        {
            var nowInUruguay = SystemClock.Instance.GetCurrentInstant().InZone(DateTimeZoneProviders.Tzdb["America/Montevideo"]);
            return nowInUruguay.ToDateTimeUnspecified();
        }

        public static string GetDatetimeUruguayString()
        {
            CultureInfo culture = new CultureInfo("es-UY");
            var nowInUruguay = SystemClock.Instance.GetCurrentInstant().InZone(DateTimeZoneProviders.Tzdb["America/Montevideo"]);
            return nowInUruguay.ToDateTimeUnspecified().ToString("G", culture);
        }

        internal static string NormalizeDiacritics(string attribute)
        {
            var normalizedString = attribute.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }
            return stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
        }

    }
}
