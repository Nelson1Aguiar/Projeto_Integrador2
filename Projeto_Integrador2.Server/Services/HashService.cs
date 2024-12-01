namespace Projeto_Integrador2.Server.Services
{
    public class HashService
    {
        public static string HashGeneration(string data)
        {
            int workfactor = 15;

            string salt = BCrypt.Net.BCrypt.GenerateSalt(workfactor);
            string hash = BCrypt.Net.BCrypt.HashPassword(data, salt);

            return hash;
        }

        public static bool PasswordCompare(string hash, string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
