using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Helper;
using Projeto_Integrador2.Server.Interface;

namespace Projeto_Integrador2.Server.Service
{
    public class Connection : IConnection
    {
        private readonly string _connectionString;
        public Connection() 
        {
            _connectionString = ConfigurationHelper.GetConnectionString("SqlConnection");
        }
        public MySqlConnection ProviderConnection()
        {
            try
            {
                MySqlConnection connection = new MySqlConnection(_connectionString);
                return connection;
            }
            catch (Exception)
            {
                throw new ApplicationException("Não foi possível estabelecer conexão com o banco");
            }
        }
    }
}
