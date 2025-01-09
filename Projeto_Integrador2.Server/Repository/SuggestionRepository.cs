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
                    command.Parameters.AddWithValue("@p_Mail", entity.Mail);

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
            throw new NotImplementedException();
        }

        public List<Suggestion> GetAll()
        {
            throw new NotImplementedException();
        }

        public void GetOne(Suggestion entity)
        {
            throw new NotImplementedException();
        }
    }
}
