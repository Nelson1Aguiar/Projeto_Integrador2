using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Transaction;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IConnection _connection;
        private readonly ITokenService _tokenService;

        public EventsController(IConnection connection, ITokenService tokenService)
        {
            _connection = connection;
            _tokenService = tokenService;
        }

        [HttpGet("GetEvents")]
        [AllowAnonymous]
        public IActionResult GetEvents()
        {
            try
            {
                List<Event> events = EventsTRA.GetAllEvents(_connection);
                return Ok(new { Success = true, Message = "Eventos obtidos com sucesso", Events = events });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "Erro interno do servidor: " + ex.Message });
            }
        }
    }
}
