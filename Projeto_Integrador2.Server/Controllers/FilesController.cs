﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;

namespace Projeto_Integrador2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IRepository<FileSTL> _filesRepository;

        public FilesController(IRepository<FileSTL> repository)
        {
            _filesRepository = repository;
        }

        [HttpGet("GetFiles")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFiles()
        {
            try
            {
                List<FileSTL> files = await _filesRepository.GetAll();
                return Ok(new { Success = true, Message = "Arquivos obtidos com sucesso", Files = files });
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

        [HttpPost("UploadFile")]
        [Authorize]
        public async Task<IActionResult> UploadFile([FromBody] FileSTL file)
        {
            try
            {
                if (file == null || file.File!.Length == 0 || string.IsNullOrEmpty(file.Name))
                {
                    return BadRequest(new { message = "Arquivo ou nome inválido." });
                }

                await _filesRepository.Create(file);
                return Ok(new { Success = true, Message = "Arquivo publicado com sucesso" });
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
