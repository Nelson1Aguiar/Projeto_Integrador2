using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using System.Data.Common;

namespace Projeto_Integrador2.Server.Repository
{
    public class SuggestionRepository : IRepository<Suggestion>
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection _mySqlConnection;
        public SuggestionRepository(IConnection connection)
        {
            _connectionProvider = connection;
            _mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public async Task Create(Suggestion entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    MySqlCommand command = new MySqlCommand("SendSuggestion", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_Suggestion", entity.SuggestionToSend);
                    command.Parameters.AddWithValue("@p_Mail", entity.Email);

                    MySqlParameter outputSuggestionId = new MySqlParameter("@p_SuggestionId", MySqlDbType.Int32)
                    {
                        Direction = System.Data.ParameterDirection.Output
                    };
                    command.Parameters.Add(outputSuggestionId);

                    await command.ExecuteNonQueryAsync();

                    entity.SuggestionId = Convert.ToInt32(outputSuggestionId.Value);
                }
                catch (Exception ex)
                {
                    // Log ou reenvio da exceção
                    throw new ApplicationException("Erro ao enviar sugestão", ex);
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

        public Task Update(Suggestion entity)
        {
            throw new NotImplementedException();
        }

        public async Task Delete(long id)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    MySqlCommand command = new MySqlCommand("DeleteSuggestion", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@p_SuggestionId", id);

                    await command.ExecuteNonQueryAsync();
                }
                catch (Exception ex)
                {
                    // Log ou reenvio da exceção
                    throw new ApplicationException("Erro ao excluir sugestão", ex);
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

        public async Task<List<Suggestion>> GetAll()
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    List<Suggestion> suggestions = new List<Suggestion>();
                    MySqlCommand command = new MySqlCommand("GetAllSuggestions", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (!reader.HasRows)
                            return new List<Suggestion>();

                        while (await reader.ReadAsync())
                        {
                            Suggestion suggestion = new Suggestion
                            {
                                SuggestionId = reader.GetInt32(reader.GetOrdinal("SuggestionId")),
                                SuggestionToSend = reader.GetString(reader.GetOrdinal("Suggestion")),
                                Email = reader.GetString(reader.GetOrdinal("Mail")),
                            };
                            suggestions.Add(suggestion);
                        }
                    }

                    return suggestions;
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao buscar sugestões", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }
            throw new ApplicationException("Conexão com o banco de dados não disponível.");
        }

        public Task GetOne(Suggestion entity)
        {
            throw new NotImplementedException();
        }

        public Task<List<Suggestion>> GetPage(int page, int pageSize)
        {
            throw new NotImplementedException();
        }
    }
}
