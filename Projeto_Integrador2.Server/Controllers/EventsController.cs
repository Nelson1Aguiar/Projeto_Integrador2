﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IRepository<Event> _eventsRepository;

        public EventsController(IRepository<Event> repository)
        {
            _eventsRepository = repository;
        }

        [HttpGet("GetEvents")]
        [AllowAnonymous]
        public IActionResult GetEvents()
        {
            try
            {
                List<Event> events = _eventsRepository.GetAll();
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

        [HttpPut("DeleteEvent")]
        [Authorize]
        public IActionResult DeleteEvent([FromBody] long id)
        {
            try
            {
                _eventsRepository.Delete(id);
                return Ok(new { Success = true, Message = "Evento excluído com sucesso"});
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

        [HttpPost("CreateEvent")]
        [Authorize]
        public IActionResult CreateEvent([FromBody] Event newEvent)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _eventsRepository.Create(newEvent);
                    return Ok(new { Success = true, Message = "Evento criado com sucesso", Id = newEvent.EventId });
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
