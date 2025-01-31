using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using System.Data.Common;

namespace Projeto_Integrador2.Server.Repository
{
    public class EventsRepository : IRepository<Event>
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection _mySqlConnection;
        public EventsRepository(IConnection connection)
        {
            _connectionProvider = connection;
            _mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public async Task<List<Event>> GetAll()
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    List<Event> events = new List<Event>();
                    MySqlCommand command = new MySqlCommand("GetAllEvents", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (!reader.HasRows)
                            return new List<Event>();

                        while (await reader.ReadAsync())
                        {
                            Event ev = new Event
                            {
                                EventId = reader.GetInt32(reader.GetOrdinal("EventId")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                StartDate = reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                Location = reader.IsDBNull(reader.GetOrdinal("Location")) ? null : reader.GetString(reader.GetOrdinal("Location")),
                                CreateUserId = reader.GetInt32(reader.GetOrdinal("CreateUserId"))
                            };
                            events.Add(ev);
                        }
                    }

                    return events;
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao buscar eventos", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }

            throw new ApplicationException("Erro ao buscar eventos. Conexão não disponível.");
        }

        public async Task Delete(long id)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    MySqlCommand command = new MySqlCommand("DeleteEvent", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_EventId", id);

                    await command.ExecuteNonQueryAsync();
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao deletar evento", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }
            else
            {
                throw new ApplicationException("Conexão com o banco de dados não disponível.");
            }
        }


        public async Task Create(Event entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    MySqlCommand command = new MySqlCommand("InsertNewEvent", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_Title", entity.Title);
                    command.Parameters.AddWithValue("@p_StartDate", entity.StartDate);
                    command.Parameters.AddWithValue("@p_EndDate", entity.EndDate);
                    command.Parameters.AddWithValue("@p_Description", entity.Description);
                    command.Parameters.AddWithValue("@p_Location", entity.Location);
                    command.Parameters.AddWithValue("@p_CreateUserId", entity.CreateUserId);

                    MySqlParameter outputEventId = new MySqlParameter("@p_EventId", MySqlDbType.Int32)
                    {
                        Direction = System.Data.ParameterDirection.Output
                    };
                    command.Parameters.Add(outputEventId);

                    await command.ExecuteNonQueryAsync();

                    entity.EventId = Convert.ToInt32(outputEventId.Value);
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao criar evento", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }
            else
            {
                throw new ApplicationException("Conexão com o banco de dados não disponível.");
            }
        }

        public async Task Update(Event entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    MySqlCommand command = new MySqlCommand("UpdateEvent", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_Title", entity.Title);
                    command.Parameters.AddWithValue("@p_StartDate", entity.StartDate);
                    command.Parameters.AddWithValue("@p_EndDate", entity.EndDate);
                    command.Parameters.AddWithValue("@p_Description", entity.Description);
                    command.Parameters.AddWithValue("@p_Location", entity.Location);
                    command.Parameters.AddWithValue("@p_EventId", entity.EventId);

                    await command.ExecuteNonQueryAsync();
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao atualizar evento", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }
            else
            {
                throw new ApplicationException("Conexão com o banco de dados não disponível.");
            }
        }

        public Task GetOne(Event entity)
        {
            throw new NotImplementedException();
        }

        public Task<List<Event>> GetPage(int page, int pageSize)
        {
            throw new NotImplementedException();
        }
    }
}