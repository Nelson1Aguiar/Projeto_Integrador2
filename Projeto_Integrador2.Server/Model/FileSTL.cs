using Projeto_Integrador2.Server.Services;

namespace Projeto_Integrador2.Server.Model
{
    public class FileSTL
    {
        public long? FileId { get; set; }
        public string Name { get; set; }
        public byte[]? Thumbnail { get; set; }
        public List<byte>? File { get; set; }
        public string? FilePath { get; set; }
        public string? ThumbnailPath { get; set; }
        public string? Extension { get; set; }
    }
}
