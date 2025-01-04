namespace Projeto_Integrador2.Server.Model
{
    public class Event
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int? EventId { get; set; }
        public int? CreateUserId { get; set; }
    }
}
