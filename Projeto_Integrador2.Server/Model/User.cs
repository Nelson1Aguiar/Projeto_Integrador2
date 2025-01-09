using Projeto_Integrador2.Server.Annotation;
using System.ComponentModel.DataAnnotations;

namespace Projeto_Integrador2.Server.Model
{
    public class User
    {

        [Required(ErrorMessage = "É necessário informar seu e-mail")]
        [ValidateEmail(ErrorMessage = "Por favor, insira um e-mail válido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "É necessário informar sua senha")]
        public string Password { get; set; }
        public long? UserId { get; set; }
        public string? Name { get; set; }
    }
}