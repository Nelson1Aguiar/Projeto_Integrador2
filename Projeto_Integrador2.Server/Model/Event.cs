using System.ComponentModel.DataAnnotations;

namespace Projeto_Integrador2.Server.Model
{
    public class Event
    {
        [Required(ErrorMessage = "É necessário definir uma data de início do evento")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "É necessário definir uma data de fim do evento")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "É necessário dar um título ao evento")]
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public long? EventId { get; set; }
        public long? CreateUserId { get; set; }
    }
}
