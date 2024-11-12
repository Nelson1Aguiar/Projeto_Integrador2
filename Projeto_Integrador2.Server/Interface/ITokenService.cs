using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Interface
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
