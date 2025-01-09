using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IRepository<User> _userRepository;

        public UserController(IRepository<User> repository, ITokenService tokenService)
        {
            _userRepository = repository;
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
                    _userRepository.GetOne(user);
                    string token = _tokenService.GenerateToken(user);
                    return Ok(new { Success = true, Message = "Login validado com sucesso", Token = token });
                }
                catch (ApplicationException ex)
                {
                    return BadRequest(new { Success = false, Message = ex.Message});
                }
                catch (Exception ex) 
                {
                    return StatusCode(500, new { Success = false, Message = "Erro interno do servidor: " + ex.Message });
                }
            }
            else
                return BadRequest(new { Success = false, Message = "Não foi possível efetuar login" });
        }

        [HttpGet("Teste")]
        [AllowAnonymous]
        public IActionResult TestEndPoint()
        {
            return Ok(new { message = "API estável" });
        }
    }
}
