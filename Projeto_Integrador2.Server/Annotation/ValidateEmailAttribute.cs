using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Projeto_Integrador2.Server.Annotation
{
    public class ValidateEmailAttribute : ValidationAttribute
    {
        private const string EmailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null)
                return ValidationResult.Success;

            var email = value.ToString();

            if (Regex.IsMatch(email, EmailPattern))
                return ValidationResult.Success;

            return new ValidationResult(ErrorMessage ?? "O endereço de e-mail é inválido.");
        }
    }
}
