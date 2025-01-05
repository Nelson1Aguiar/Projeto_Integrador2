using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Repository
{
    public class EventsRepository
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection mySqlConnection;
        public EventsRepository(IConnection connection)
        {
            _connectionProvider = connection;
            mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public List<Event> GetAllEvents()
        {
            if (mySqlConnection != null)
            {
                try
                {
                    mySqlConnection.Open();
                    List<Event> events = new List<Event>();
                    MySqlCommand command = new MySqlCommand("GetAllEvents", mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    MySqlDataReader reader = command.ExecuteReader();

                    if (!reader.HasRows)
                        throw new ApplicationException("Nenhum evento cadastrado");

                    while (reader.Read())
                    {
                        Event ev = new Event
                        {
                            EventId = reader.GetInt32("EventId"),
                            Title = reader.GetString("Title"),
                            StartDate = reader.GetDateTime("StartDate"),
                            EndDate = reader.GetDateTime("EndDate"),
                            Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString("Description"),
                            Location = reader.IsDBNull(reader.GetOrdinal("Location")) ? null : reader.GetString("Location"),
                            CreateUserId = reader.GetInt32("CreateUserId")
                        };
                        events.Add(ev);
                    }

                    return events;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    mySqlConnection.Close();
                }
            }
            throw new ApplicationException("Erro ao buscar eventos");
        }
    }
}