using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Repository;

namespace Projeto_Integrador2.Server.Transaction
{
    public class UserTRA
    {
        public static void ValidateLogin(User user, IConnection connection)
        {
            try
            {
                UserRepository userBUS = new UserRepository(connection);
                userBUS.ValidateUserCredentials(user);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
