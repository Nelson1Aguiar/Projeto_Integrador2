using Microsoft.Extensions.Configuration;
using System.Configuration;

namespace Projeto_Integrador2.Server.Helper
{
    public class ConfigurationHelper
    {
        private static readonly IConfigurationRoot _configuration;
        static ConfigurationHelper()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            _configuration = builder.Build();
        }

        public static string GetConnectionString(string name)
        {
            try
            {
                return _configuration.GetConnectionString(name);
            }
            catch (Exception)
            {
                throw new ApplicationException("Não foi possível estabelecer conexão com o banco");
            }
        }

        public static string GetKey(string key)
        {
            try
            {
                return _configuration[$"appSettings:{key}"];
            }
            catch (Exception)
            {
                return "";
            }
        }
    }
}
