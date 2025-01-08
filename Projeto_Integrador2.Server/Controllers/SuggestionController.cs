using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Transaction;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SuggestionController : ControllerBase
    {
        private readonly IConnection _connection;

        public SuggestionController(IConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("SendSuggestion")]
        [AllowAnonymous]
        public IActionResult SendSuggestion([FromBody] Suggestion suggestion)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    SuggestionTRA.SendSuggestion(_connection, suggestion);
                    return Ok(new { Success = true, Message = "Sugestão enviada", Id = suggestion.SuggestionId });
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
            else
                return BadRequest(new { Success = false, Message = "Dados inválidos", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
        }
    }
}
