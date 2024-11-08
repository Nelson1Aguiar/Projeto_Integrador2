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

        public UserController(IConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user != null)
            {
                try
                {
                    UserTRA.ValidateLogin(user,_connection);
                    return Ok(new { status = "success", message = "Conta criada com sucesso!" });
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

    }
}
