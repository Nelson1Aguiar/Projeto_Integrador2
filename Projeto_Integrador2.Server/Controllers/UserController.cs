using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Transaction;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConnection _connection;
        private readonly ITokenService _tokenService;

        public UserController(IConnection connection, ITokenService tokenService)
        {
            _connection = connection;
            _tokenService = tokenService;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] User user)
        {
            if (user != null)
            {
                try
                {
                    UserTRA.ValidateLogin(user,_connection);
                    string token = _tokenService.GenerateToken(user);
                    return Ok(new { Success = true, message = "Conta criada com sucesso!", Token = token });
                }
                catch (ApplicationException ex)
                {
                    return BadRequest(new {success = false, message = ex});
                }
                catch (Exception ex) 
                {
                    return StatusCode(500, new {success = false, message = "Erro interno do servidor: " + ex.Message });
                }
            }
            else
                return BadRequest(new { success = false, message = "Não foi possível efetuar login" });
        }

        [Authorize]
        [HttpGet("teste")]
        public IActionResult TestEndPointSecurity()
        {
            return Ok(new { message = "Endpoint seguro" });
        }
    }
}
