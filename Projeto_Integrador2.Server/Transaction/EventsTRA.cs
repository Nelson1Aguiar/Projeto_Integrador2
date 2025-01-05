using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Repository;

namespace Projeto_Integrador2.Server.Transaction
{
    public class EventsTRA
    {
        public static List<Event> GetAllEvents(IConnection connection)
        {
            try
            {
                EventsRepository eventsBUS = new EventsRepository(connection);
                List<Event> events = eventsBUS.GetAllEvents();
                return events;
            }
            catch (Exception ex) 
            {
                throw;
            }
        }

        public static void DeleteEvent(IConnection connection, long id)
        {
            try
            {
                EventsRepository eventsBUS = new EventsRepository(connection);
                eventsBUS.DeleteEvent(id);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
