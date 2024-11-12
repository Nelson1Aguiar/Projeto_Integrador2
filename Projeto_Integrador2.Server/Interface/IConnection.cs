using MySql.Data.MySqlClient;

namespace Projeto_Integrador2.Server.Interface
{
    public interface IConnection
    {
        MySqlConnection ProviderConnection();
    }
}
