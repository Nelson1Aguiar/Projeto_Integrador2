using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Repository
{
    public class EventsRepository
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection _mySqlConnection;
        public EventsRepository(IConnection connection)
        {
            _connectionProvider = connection;
            _mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public List<Event> GetAllEvents()
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    List<Event> events = new List<Event>();
                    MySqlCommand command = new MySqlCommand("GetAllEvents", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    MySqlDataReader reader = command.ExecuteReader();

                    if (!reader.HasRows)
                        return new List<Event>();

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
                    throw;
                }
                finally
                {
                    _mySqlConnection.Close();
                }
            }
            throw new ApplicationException("Erro ao buscar eventos");
        }

        public void DeleteEvent(long id)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    MySqlCommand command = new MySqlCommand("DeleteEvent", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@p_EventId", id);
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    _mySqlConnection.Close();
                }
            }
        }

        public void InsertNewEvent(Event newEvent)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    MySqlCommand command = new MySqlCommand("InsertNewEvent", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@p_Title", newEvent.Title);
                    command.Parameters.AddWithValue("@p_StartDate", newEvent.StartDate);
                    command.Parameters.AddWithValue("@p_EndDate", newEvent.EndDate);
                    command.Parameters.AddWithValue("@p_Description", newEvent.Description);
                    command.Parameters.AddWithValue("@p_Location", newEvent.Location);
                    command.Parameters.AddWithValue("@p_CreateUserId", newEvent.CreateUserId);

                    MySqlParameter outputEventId = new MySqlParameter("@p_EventId", MySqlDbType.Int32);
                    outputEventId.Direction = System.Data.ParameterDirection.Output;
                    command.Parameters.Add(outputEventId);

                    command.ExecuteNonQuery();

                    newEvent.EventId = Convert.ToInt32(outputEventId.Value);
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    _mySqlConnection.Close();
                }
            }
        }
    }
}