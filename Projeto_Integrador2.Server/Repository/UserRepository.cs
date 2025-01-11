using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Services;

namespace Projeto_Integrador2.Server.Repository
{
    public class UserRepository : IRepository<User>
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection _mySqlConnection;
        public UserRepository(IConnection connection)
        {
            _connectionProvider = connection;
            _mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public void GetOne(User entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    _mySqlConnection.Open();
                    MySqlCommand command = new MySqlCommand("ValidateUserCredentials", _mySqlConnection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@p_Email", entity.Email);
                    MySqlDataReader reader = command.ExecuteReader();

                    if (!reader.HasRows)
                        throw new ApplicationException("Login inválido!");

                    reader.Read();

                    if(!HashService.PasswordCompare(reader.GetString("Password"), entity.Password))
                        throw new ApplicationException("Login inválido!");

                    entity.UserId = reader.GetInt32("UserId");
                    entity.Name = reader.GetString("Name");
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    _mySqlConnection.Close();
                }
            }
        }

        public List<User> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Create(User entity)
        {
            throw new NotImplementedException();
        }

        public void Update(User entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }
    }
}
