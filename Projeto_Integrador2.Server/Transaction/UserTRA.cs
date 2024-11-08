using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Business;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Transaction
{
    public class UserTRA
    {
        public static void ValidateLogin(User user, IConnection connection)
        {
            try
            {
                UserBUS userBUS = new UserBUS(connection);
                userBUS.ValdiateUserCredentials(user);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
