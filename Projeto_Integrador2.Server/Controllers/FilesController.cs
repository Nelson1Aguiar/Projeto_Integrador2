using Microsoft.AspNetCore.Authorization;
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
        public async Task<IActionResult> GetFiles([FromQuery] int page, [FromQuery] int pageSize)
        {
            try
            {
                List<FileSTL> files = await _filesRepository.GetPage(page, pageSize);

                files.RemoveAll(file => !System.IO.File.Exists(file.ThumbnailPath));

                foreach (FileSTL file in files)
                {
                    string extension = Path.GetExtension(file.ThumbnailPath).ToLower();

                    if (extension == ".png" || extension == ".jpg" || extension == ".jpeg")
                    {
                        byte[]? imageBytes = System.IO.File.ReadAllBytes(file.ThumbnailPath);
                        
                        file.Thumbnail = imageBytes;
                    }
                }

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

        [HttpGet("GetFileBytes")]
        [AllowAnonymous]
        public IActionResult GetFileBytes()
        {
            try
            {
                if (!Request.Headers.TryGetValue("Path", out var path))
                {
                    return BadRequest(new { Success = false, Message = "Caminho não fornecido" });
                }

                if (string.IsNullOrWhiteSpace(path))
                {
                    return BadRequest(new { Success = false, Message = "Caminho inválido" });
                }

                if (!System.IO.File.Exists(path))
                {
                    return NotFound(new { Success = false, Message = "Arquivo não encontrado" });
                }

                byte[] fileBytes = System.IO.File.ReadAllBytes(path);


                return Ok(new { Success = true, Message = "Arquivo obtido com sucesso", Base64 = fileBytes });
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

        [HttpGet("GetAllFilesNames")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllFilesNames()
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
                if (file.File == null || file.File.Count() < 1)
                {
                    return BadRequest(new { message = "Arquivo inválido." });
                }

                await _filesRepository.Create(file);
                return Ok(new { Success = true, Message = "Arquivo publicado com sucesso", FileName = file.Name, FileId = file.FileId });
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
