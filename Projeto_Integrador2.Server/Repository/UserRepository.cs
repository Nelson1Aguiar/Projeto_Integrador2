using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Services;
using System.Data.Common;

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

        public async Task GetOne(User entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    MySqlCommand command = new MySqlCommand("ValidateUserCredentials", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@p_Email", entity.Email);

                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (!reader.HasRows)
                            throw new ApplicationException("Login inválido!");

                        await reader.ReadAsync();

                        if (!HashService.PasswordCompare(reader.GetString(reader.GetOrdinal("Password")), entity.Password))
                            throw new ApplicationException("Login inválido!");

                        entity.UserId = reader.GetInt32(reader.GetOrdinal("UserId"));
                        entity.Name = reader.GetString(reader.GetOrdinal("Name"));
                    }
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao validar usuário", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }
            else
            {
                throw new ApplicationException("Conexão com o banco de dados não disponível.");
            }
        }


        public Task<List<User>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task Create(User entity)
        {
            throw new NotImplementedException();
        }

        public Task Update(User entity)
        {
            throw new NotImplementedException();
        }

        public Task Delete(long id)
        {
            throw new NotImplementedException();
        }
    }
}
