using MySql.Data.MySqlClient;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Services;
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

                    MySqlCommand command = new MySqlCommand("GetAllFilePath", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    using (DbDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (!reader.HasRows)
                            return files;

                        while (await reader.ReadAsync())
                        {
                            FileSTL file = new FileSTL()
                            {
                                FileId = reader.IsDBNull(reader.GetOrdinal("FileId")) ? 0 : reader.GetInt32("FileId"),
                                ThumbnailPath = reader.GetString("ThumbnailPath"),
                                FilePath = reader.GetString("FilePath"),
                                Name = reader.GetString("Name")
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
                    FileStorageService fileStorageService = new FileStorageService();
                    fileStorageService.Save3DModelAndThumbnail(entity);

                    if (string.IsNullOrEmpty(entity.FilePath) || string.IsNullOrEmpty(entity.ThumbnailPath))
                        throw new ApplicationException("Não foi possível enviar o arquivo");

                    await _mySqlConnection.OpenAsync();

                    MySqlCommand command = new MySqlCommand("InsertNewFile", _mySqlConnection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@p_Name", entity.Name);
                    command.Parameters.AddWithValue("@p_FilePath", entity.FilePath);
                    command.Parameters.AddWithValue("@p_ThumbnailPath", entity.ThumbnailPath);

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
