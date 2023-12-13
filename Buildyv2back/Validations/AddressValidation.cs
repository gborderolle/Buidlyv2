using System.ComponentModel.DataAnnotations;

namespace Buildyv2.Validations
{
    public class AddressValidation : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return ValidationResult.Success;
            }
            // ToDo: Verificar dirección con OSM
            var firstChar = value.ToString()[0].ToString();
            if (firstChar != firstChar.ToUpper())
            {
                return new ValidationResult("La primera letra debe ser mayúscula");
            }
            return ValidationResult.Success;
        }

    }
}