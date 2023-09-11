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
            CultureInfo culture = new("es-UY");
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

        internal static string GetEmailNotificationBody(UserCredential userCredential, string? clientIP, string? clientIPCity, bool isMobile)
        {
            string device = isMobile ? "celular" : "computadora";
            string body = $"<div><strong>API Web Service</strong></div>";
            body += $"<div>Notificación de acceso a la plataforma.</div>";
            body += "<br/>";
            body += $"<div><strong>Login user: </strong>{userCredential.Email}</div>";
            body += $"<div><strong>User IP: </strong>{clientIP}</div>";
            body += $"<div><strong>User City: </strong>{clientIPCity}</div>";
            body += $"<div><strong>Dispositivo: </strong>{device}</div>";
            body += "<br/>";
            //body += "<div><font size='2'><strong><span style='color:#e15211'>------------------------------<wbr>------------------------------<wbr>-------------</span></strong></font></div>";
            //body += "<div><strong><span style='font-size:12pt;color:#e15211'>Accesos</span></strong></div>";
            //body += "<div><strong><a href='www.buildy.lat' title='' target='_blank'>Dashboard</a></strong></div>";
            //body += "<br/><br/>";
            body += "<div>Este es un email auto-generado, por favor no lo responda.</div>";
            body += $"<div>Fecha creación: {GetDatetimeUruguayString()}</div>";
            return body;
        }

    }
}
