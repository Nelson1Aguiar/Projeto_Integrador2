using Projeto_Integrador2.Server.Services;

namespace Projeto_Integrador2.Server.Model
{
    public class FileSTL
    {
        public long? FileId { get; set; }
        public string Name { get; set; }
        public byte[]? Thumbnail { get; set; }
        public byte[]? File { get; set; }

        public FileSTL(long id, byte[] thumbnail, string name)
        {
            this.FileId = id;
            this.Thumbnail = thumbnail;
            this.Name = name;
        }
    }
}
