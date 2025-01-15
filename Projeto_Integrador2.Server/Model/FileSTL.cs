using Projeto_Integrador2.Server.Services;
using System.IO;
using System.Xml;

namespace Projeto_Integrador2.Server.Model
{
    public class FileSTL
    {
        public long? FileId { get; set; }
        public string Name { get; set; }
        public byte[]? Thumbnail { get; set; }
        public byte[]? File { get; set; }

        public FileSTL(IFormFile file, string name)
        {
            this.Name = name;
            this.File = GetFileBytes(file);
            this.Thumbnail = ThumbnailService.GenerateThumbnail();
        }

        private static byte[] GetFileBytes(IFormFile file)
        {
            using (var stream = new MemoryStream())
            {
                file.CopyTo(stream);
                return stream.ToArray();
            }
        }
    }
}
