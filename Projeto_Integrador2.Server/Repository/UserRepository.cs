using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

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
                    command.Parameters.AddWithValue("@p_Password", user.Password);
                    MySqlDataReader reader = command.ExecuteReader();
                    reader.Read();
                    user.UserId = reader.GetInt32("UserId");
                    user.Name = reader.GetString("Name");
                    mySqlConnection.Close();
                }
                catch (Exception ex)
                {
                    mySqlConnection.Close();
                    throw new ApplicationException("Login inválido!");
                }
            }
        }
    }
}
