using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Business
{
    public class UserBUS
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection mySqlConnection;
        public UserBUS(IConnection connection)
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
                    command.Parameters.AddWithValue("@p_email", user.Email);
                    command.Parameters.AddWithValue("@p_password", user.Password);
                    MySqlDataReader reader = command.ExecuteReader();
                    reader.Read();
                    user.Id = reader.GetInt32("id");
                    user.Name = reader.GetString("name");
                    mySqlConnection.Close();
                }
                catch (Exception ex)
                {
                    mySqlConnection.Close();
                    throw ex;
                }
            }
        }
    }
}
