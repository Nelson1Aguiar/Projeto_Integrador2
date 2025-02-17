﻿using Projeto_Integrador2.Server.Annotation;
using System.ComponentModel.DataAnnotations;

namespace Projeto_Integrador2.Server.Model
{
    public class Suggestion
    {
        [Required(ErrorMessage = "É necessário enviar uma sugestão")]
        public string SuggestionToSend { get; set; }

        [Required(ErrorMessage = "É necessário informar seu e-mail")]
        [ValidateEmail(ErrorMessage = "Por favor, insira um e-mail válido.")]
        public string Email { get; set; }

        public long? SuggestionId { get; set; }
    }
}
