using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SuggestionController : ControllerBase
    {
        private readonly IRepository<Suggestion> _suggestionRepository;

        public SuggestionController(IRepository<Suggestion> repository)
        {
            _suggestionRepository = repository;
        }

        [HttpPost("SendSuggestion")]
        [AllowAnonymous]
        public IActionResult SendSuggestion([FromBody] Suggestion suggestion)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _suggestionRepository.Create(suggestion);
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

        [HttpGet("GetAllSuggestions")]
        [Authorize]
        public IActionResult GetAllSuggestions()
        {
            try
            {
                List<Suggestion> suggestions = _suggestionRepository.GetAll();
                return Ok(new { Success = true, Suggestions = suggestions });
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

        [HttpDelete("DeleteSuggestion")]
        [Authorize]
        public IActionResult DeleteSuggestion([FromBody] long id)
        {
            try
            {
                _suggestionRepository.Delete(id);
                return Ok(new { Success = true, Message = "Sugestão excluída com sucesso" });
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
