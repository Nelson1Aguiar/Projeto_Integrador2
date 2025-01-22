import "./Grid.css";
import { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import STLViewer from "./STLViewer/STLViewer.jsx"

const Grid = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const imagesPerPage = 4;

    const handleNext = () => {
        if (currentIndex + imagesPerPage < files.length)
            setCurrentIndex(currentIndex + imagesPerPage);
    };

    const handlePrevious = () => {
        if (currentIndex - imagesPerPage >= 0)
            setCurrentIndex(currentIndex - imagesPerPage);
    };

    const GetAllImages = async () => {
        const apiUrlGetAllThumb = import.meta.env.VITE_API_URL_GET_ALL_FILES;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };

        try {
            const response = await fetch(apiUrlGetAllThumb, options);
            const data = await response.json();

            if (!response.ok) {
                const message = data.message || "Erro desconhecido";
                alert(message);
                throw new Error(message);
            }

            const mappedFiles = data.files.map(file => ({
                FileId: file.fileId,
                Name: file.name,
                FilePath: file.filePath,
                Thumbnail: file.thumbnail ? GenerateThumbnailByBase64(file.thumbnail) : null
            }));

            setFiles(mappedFiles);
        }
        catch (error) {
            console.error("Erro ao carregar imagem:", error);
        }
    }

    const GenerateThumbnailByBase64 = (base64) => {
        if (!base64) {
            console.error('Base64 vazio ou inválido:', base64);
            return null;
        }

        try {
            const byteCharacters = atob(base64);
            const byteArrays = new Uint8Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteArrays], { type: 'image/png' });

            const objectURL = URL.createObjectURL(blob);

            return objectURL;
        } catch (error) {
            console.error('Erro ao gerar o Blob:', error);
            return null;
        }
    };

    useEffect(() => {
        GetAllImages();

        const intervalId = setInterval(() => {
            GetAllImages();
        }, 300000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        return () => {
            files.forEach(file => {
                if (file.Thumbnail) {
                    URL.revokeObjectURL(file.Thumbnail);
                }
            });
        };
    }, [files]);

    const GetSTLPath = async (filePath) => {
        const apiUrlGetFileBytes = import.meta.env.VITE_API_URL_GET_FILE_BYTES;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Path": filePath
            },
        };

        try {
            const response = await fetch(apiUrlGetFileBytes, options);
            const data = await response.json();

            if (!data.base64) {
                alert("Dados do arquivo estão vazios");
                return;
            }

            if (!response.ok) {
                const message = data.message || "Erro desconhecido";
                alert(message);
                throw new Error(message);
            }

            openModal(data.base64)
        }
        catch (error) {
            console.error("Erro ao carregar imagem:", error);
        }
    }

    const openModal = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    return (
        <div className="gallery-container">
            <div className="image-grid">
                {files.slice(currentIndex, currentIndex + imagesPerPage).map((file, index) => (
                    <img
                        key={file.FileId}
                        src={file.Thumbnail || 'fallback-image.png'}
                        alt={`Imagem ${currentIndex + index + 1}`}
                        title={file.Name}
                        className="gallery-image"
                        onClick={() => GetSTLPath(file.FilePath)}
                    />
                ))}
            </div>
            <div className="button-container">
                <button className="navButtonGrid prevButton" onClick={handlePrevious} disabled={currentIndex === 0}>
                    <IoChevronBack className="prevIcon" />
                </button>
                <button className="navButtonGrid nextButton" onClick={handleNext} disabled={currentIndex + imagesPerPage >= files.length}>
                    <IoChevronForward />
                </button>
            </div>

            {isModalOpen && (
                <div className="overlay active" onClick={closeModal}></div>
            )}

            {isModalOpen && selectedFile && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <STLViewer stlData={selectedFile} />
                        <button className="close-modal" onClick={closeModal}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Grid;
