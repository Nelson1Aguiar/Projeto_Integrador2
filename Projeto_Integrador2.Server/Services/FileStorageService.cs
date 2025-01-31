using Assimp;
using Projeto_Integrador2.Server.Helper;
using Projeto_Integrador2.Server.Model;
using SkiaSharp;
using System.IO;

namespace Projeto_Integrador2.Server.Services
{
    public class FileStorageService
    {
        private readonly string _stlFolder = ConfigurationHelper.DefaultStlDirectory();
        private readonly string _thumbnailFolder = ConfigurationHelper.DefaultThumbnailDirectory();

        public FileStorageService()
        {
            Directory.CreateDirectory(_stlFolder);
            Directory.CreateDirectory(_thumbnailFolder);
        }

        public void Save3DModelAndThumbnail(FileSTL file)
        {
            byte[]? modelBytes = file.File.ToArray();
            string uniqueId = Guid.NewGuid().ToString();
            string modelFilePath = Path.Combine(_stlFolder, $"{uniqueId}{file.Extension}");
            string thumbnailFilePath = Path.Combine(_thumbnailFolder, $"{uniqueId}.png");

            File.WriteAllBytes(modelFilePath, modelBytes);

            byte[] thumbnailBytes = GenerateThumbnail(modelBytes, file.Extension);
            File.WriteAllBytes(thumbnailFilePath, thumbnailBytes);

            file.ThumbnailPath = thumbnailFilePath;
            file.FilePath = modelFilePath;
        }

        public byte[]? GenerateThumbnail(byte[]? modelBytes, string fileExtension)
        {
            // Carregar o modelo 3D com base na extensão do arquivo
            Scene model = Load3DModelFromBytes(modelBytes, fileExtension);

            // Gerar imagem 2D a partir do modelo 3D
            SKBitmap thumbnailImage = RenderThumbnailFromModel(model);

            // Converter a imagem para bytes (ex: PNG)
            return ImageToBytes(thumbnailImage);
        }

        private Scene Load3DModelFromBytes(byte[]? modelBytes, string fileExtension)
        {
            // Verifica se os bytes do modelo estão vazios ou nulos
            if (modelBytes == null || modelBytes.Length == 0)
            {
                throw new InvalidOperationException("O arquivo enviado está vazio ou inválido.");
            }

            using (MemoryStream memoryStream = new MemoryStream(modelBytes))
            {
                AssimpContext importer = new AssimpContext();

                PostProcessSteps postProcessSteps = PostProcessSteps.Triangulate |
                                                    PostProcessSteps.FlipWindingOrder |
                                                    PostProcessSteps.GenerateNormals |
                                                    PostProcessSteps.CalculateTangentSpace |
                                                    PostProcessSteps.ValidateDataStructure |
                                                    PostProcessSteps.OptimizeMeshes;

                Scene scene = null;
                try
                {
                    scene = importer.ImportFileFromStream(memoryStream, postProcessSteps, fileExtension.ToLower());
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException($"Erro ao importar o modelo 3D: {ex.Message}", ex);
                }

                // Verifica se a cena foi carregada corretamente e se possui meshes
                if (scene == null || scene.Meshes.Count == 0)
                {
                    throw new InvalidOperationException($"Erro ao carregar o arquivo 3D ({fileExtension}). Verifique o formato do arquivo.");
                }

                return scene;
            }
        }

        private SKBitmap RenderThumbnailFromModel(Scene model)
        {
            const int width = 256;  // Largura da miniatura
            const int height = 256; // Altura da miniatura

            SKBitmap bitmap = new SKBitmap(width, height);
            SKCanvas canvas = new SKCanvas(bitmap);

            canvas.Clear(SKColors.White);

            (Vector3D min, Vector3D max) = GetBoundingBox(model);

            float scale = Math.Min(width / (max.X - min.X), height / (max.Z - min.Z)) * 0.9f;
            float offsetX = width / 2f - (max.X + min.X) / 2f * scale;
            float offsetY = height / 2f + (max.Z + min.Z) / 2f * scale; // Invertido no eixo Z

            foreach (Mesh mesh in model.Meshes)
            {
                foreach (Face face in mesh.Faces)
                {
                    if (face.Indices.Count == 3)
                    {
                        Vector3D p1 = mesh.Vertices[face.Indices[0]];
                        Vector3D p2 = mesh.Vertices[face.Indices[1]];
                        Vector3D p3 = mesh.Vertices[face.Indices[2]];

                        Vector3D normal = Vector3D.Cross(p2 - p1, p3 - p1);
                        normal.Normalize();

                        SKColor faceColor = CalculateShading(normal);

                        SKPoint p1_2d = ProjectVertex(p1, scale, offsetX, offsetY);
                        SKPoint p2_2d = ProjectVertex(p2, scale, offsetX, offsetY);
                        SKPoint p3_2d = ProjectVertex(p3, scale, offsetX, offsetY);

                        using (var paint = new SKPaint { Color = faceColor, IsAntialias = true, Style = SKPaintStyle.Fill })
                        {
                            SKPath path = new SKPath();
                            path.MoveTo(p1_2d);
                            path.LineTo(p2_2d);
                            path.LineTo(p3_2d);
                            path.Close();

                            canvas.DrawPath(path, paint);
                        }
                    }
                }
            }

            canvas.Flush();
            return bitmap;
        }

        private (Vector3D min, Vector3D max) GetBoundingBox(Scene model)
        {
            Vector3D min = new Vector3D(float.MaxValue, float.MaxValue, float.MaxValue);
            Vector3D max = new Vector3D(float.MinValue, float.MinValue, float.MinValue);

            foreach (Mesh mesh in model.Meshes)
            {
                foreach (Vector3D vertex in mesh.Vertices)
                {
                    min.X = Math.Min(min.X, vertex.X);
                    min.Y = Math.Min(min.Y, vertex.Y);
                    min.Z = Math.Min(min.Z, vertex.Z);

                    max.X = Math.Max(max.X, vertex.X);
                    max.Y = Math.Max(max.Y, vertex.Y);
                    max.Z = Math.Max(max.Z, vertex.Z);
                }
            }
            return (min, max);
        }

        private SKPoint ProjectVertex(Vector3D vertex, float scale, float offsetX, float offsetY)
        {
            return new SKPoint(vertex.X * scale + offsetX, -vertex.Z * scale + offsetY); // Invertido no eixo Z
        }

        private SKColor CalculateShading(Vector3D normal)
        {
            Vector3D lightDirection = new Vector3D(0, -1, -1); // Luz vindo diagonalmente do topo
            lightDirection.Normalize();
            float intensity = Math.Max(0, Vector3D.Dot(normal, lightDirection));
            byte shade = (byte)(intensity * 255);
            return new SKColor(shade, shade, shade);
        }

        private byte[] ImageToBytes(SKBitmap bitmap)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                bitmap.Encode(SKEncodedImageFormat.Jpeg, 100).SaveTo(ms);
                return ms.ToArray();
            }
        }
    }
}
