using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

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

        public void Create(Suggestion entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    MySqlCommand command = new MySqlCommand("SendSuggestion", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@p_Suggestion", entity.SuggestionToSend);
                    command.Parameters.AddWithValue("@p_Mail", entity.Email);

                    MySqlParameter outputSuggestionId = new MySqlParameter("@p_SuggestionId", MySqlDbType.Int32);
                    outputSuggestionId.Direction = System.Data.ParameterDirection.Output;
                    command.Parameters.Add(outputSuggestionId);

                    command.ExecuteNonQuery();

                    entity.SuggestionId = Convert.ToInt32(outputSuggestionId.Value);
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

        public void Update(Suggestion entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    MySqlCommand command = new MySqlCommand("DeleteSuggestion", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@p_SuggestionId", id);
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

        public List<Suggestion> GetAll()
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    List<Suggestion> suggestions = new List<Suggestion>();
                    MySqlCommand command = new MySqlCommand("GetAllSuggestions", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    MySqlDataReader reader = command.ExecuteReader();

                    if (!reader.HasRows)
                        return new List<Suggestion>();

                    while (reader.Read())
                    {
                        Suggestion suggestion = new Suggestion
                        {
                            SuggestionId = reader.GetInt32("SuggestionId"),
                            SuggestionToSend = reader.GetString("Suggestion"),
                            Email = reader.GetString("Mail"),
                        };
                        suggestions.Add(suggestion);
                    }

                    return suggestions;
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
            throw new ApplicationException("Erro ao buscar sugestões");
        }

        public void GetOne(Suggestion entity)
        {
            throw new NotImplementedException();
        }
    }
}
