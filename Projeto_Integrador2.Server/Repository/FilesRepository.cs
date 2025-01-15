using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using System.Data;
using System.Data.Common;

namespace Projeto_Integrador2.Server.Repository
{
    public class FilesRepository : IRepository<FileSTL>
    {
        private readonly IConnection _connectionProvider;
        private readonly MySqlConnection _mySqlConnection;
        public FilesRepository(IConnection connection)
        {
            _connectionProvider = connection;
            _mySqlConnection = _connectionProvider.ProviderConnection();
        }

        public async Task<List<FileSTL>> GetAll()
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();
                    List<FileSTL> files = new List<FileSTL>();

                    MySqlCommand command = new MySqlCommand("GetAllFiles", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (!reader.HasRows)
                            return new List<FileSTL>();

                        while (await reader.ReadAsync())
                        {
                            int fileId = reader.IsDBNull(reader.GetOrdinal("FileId")) ? 0 : reader.GetInt32("FileId");

                            byte[] fileData = reader.IsDBNull(reader.GetOrdinal("File")) ? null : (byte[])reader["File"];

                            FileSTL file = new FileSTL
                            {
                                FileId = fileId,
                                Name = reader.GetString("Name"),
                                File = fileData
                            };

                            files.Add(file);
                        }
                    }

                    return files;
                }
                catch (Exception ex)
                {
                    throw new ApplicationException($"Erro ao buscar arquivos: {ex.Message}", ex);
                }
                finally
                {
                    await _mySqlConnection.CloseAsync();
                }
            }
            throw new ApplicationException("Erro ao buscar arquivos. Conexão não disponível.");
        }

        public async Task Create(FileSTL entity)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();

                    #region MOCK
                    string filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), "dragonSTL.stl");
                    byte[] fileBytes = await File.ReadAllBytesAsync(filePath);
                    entity.File = fileBytes;
                    #endregion

                    MySqlCommand command = new MySqlCommand("InsertNewFile", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_Name", entity.Name);
                    command.Parameters.AddWithValue("@p_File", entity.File);
                    command.Parameters.AddWithValue("@p_Thumbnail", entity.Thumbnail);

                    MySqlParameter outputFileId = new MySqlParameter("@p_FileId", MySqlDbType.Int32)
                    {
                        Direction = System.Data.ParameterDirection.Output
                    };
                    command.Parameters.Add(outputFileId);

                    await command.ExecuteNonQueryAsync();

                    entity.FileId = Convert.ToInt32(outputFileId.Value);
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao criar o arquivo", ex);
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

        public async Task Delete(long id)
        {
            if (_mySqlConnection != null)
            {
                try
                {
                    await _mySqlConnection.OpenAsync();

                    MySqlCommand command = new MySqlCommand("DeleteFile", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_FileId", id);

                    await command.ExecuteNonQueryAsync();
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("Erro ao excluir o arquivo", ex);
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

        public Task Update(FileSTL entity)
        {
            throw new NotImplementedException();
        }

        public Task GetOne(FileSTL entity)
        {
            throw new NotImplementedException();
        }
    }
}
