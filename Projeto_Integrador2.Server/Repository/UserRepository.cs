using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Services;

namespace Projeto_Integrador2.Server.Repository
{
    public class UserRepository
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection mySqlConnection;
        public UserRepository(IConnection connection)
        {
            _connectionProvider = connection;
            mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public void ValidateUserCredentials(User user)
        {
            if (mySqlConnection != null)
            {
                try
                {
                    mySqlConnection.Open();
                    MySqlCommand command = new MySqlCommand("ValidateUserCredentials", mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@p_Email", user.Email);
                    MySqlDataReader reader = command.ExecuteReader();

                    if (!reader.HasRows)
                        throw new ApplicationException("Login inválido!");

                    reader.Read();

                    if(!HashService.PasswordCompare(reader.GetString("Password"), user.Password))
                        throw new ApplicationException("Login inválido!");

                    user.UserId = reader.GetInt32("UserId");
                    user.Name = reader.GetString("Name");
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
        }
    }
}
