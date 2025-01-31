import { useState, useEffect, useCallback } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import STLViewer from "./STLViewer/STLViewer.jsx";
import PropTypes from 'prop-types';
import "./Grid.css";

const Grid = ({ updateFileList, setUpdateFileList, hasPathBySearchBar, setHasPathBySearchBar, pathToOpen }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const imagesPerPage = 4;

    const GetAllImages = useCallback(async (page, pageSize) => {
        const apiUrlGetAllThumb = `${import.meta.env.VITE_API_URL_GET_ALL_FILES}?page=${page}&pageSize=${pageSize}`;

        try {
            const response = await fetch(apiUrlGetAllThumb, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro desconhecido");
            }

            if (data.files.length > 0) {
                const mappedFiles = data.files.map(file => ({
                    FileId: file.fileId,
                    Name: file.name,
                    FilePath: file.filePath,
                    Thumbnail: file.thumbnail ? GenerateThumbnailByBase64(file.thumbnail) : null
                }));

                return mappedFiles;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
            return [];
        }
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            const newFiles = await GetAllImages(currentPage, imagesPerPage);
            setFiles(newFiles);

            const nextPageFiles = await GetAllImages(currentPage + 1, imagesPerPage);
            setHasNextPage(nextPageFiles.length > 0);
            setIsLoading(false);
        };

        fetchImages();
    }, [currentPage, GetAllImages]);

    useEffect(() => {
        if (updateFileList) {
            const fetchImages = async () => {
                const newFiles = await GetAllImages(currentPage, imagesPerPage);
                setFiles(newFiles);
                setUpdateFileList(false);
            };

            fetchImages();
        }
    }, [updateFileList, currentPage, GetAllImages, setUpdateFileList]);

    useEffect(() => {
        if (hasPathBySearchBar) {
            GetSTLPath(pathToOpen);
            setHasPathBySearchBar(false);
        }
    }, [hasPathBySearchBar]);

    useEffect(() => {
        const fetchImages = async () => {
            const newFiles = await GetAllImages(currentPage, imagesPerPage);
            setFiles(newFiles);
        };

        const intervalId = setInterval(fetchImages, 300000);

        return () => clearInterval(intervalId);
    }, [currentPage, GetAllImages]);

    const GenerateThumbnailByBase64 = (base64) => {
        if (!base64) return null;

        try {
            const byteCharacters = atob(base64);
            const byteArrays = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays[i] = byteCharacters.charCodeAt(i);
            }
            return URL.createObjectURL(new Blob([byteArrays], { type: 'image/jpeg' }));
        } catch (error) {
            console.error('Erro ao gerar Blob:', error);
            return null;
        }
    };

    const GetSTLPath = async (filePath) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL_GET_FILE_BYTES, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Path": filePath },
            });

            const data = await response.json();

            if (!response.ok || !data.base64) {
                throw new Error(data.message || "Erro ao carregar o arquivo.");
            }

            openModal(data.base64);
        } catch (error) {
            console.error("Erro ao carregar STL:", error);
        }
    };

    const openModal = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedFile(null);
        setIsModalOpen(false);
    };

    return (
        <div className="gallery-container">
            {isLoading && (
                <></>
            )}
            <div className={`image-grid ${isLoading ? 'loading' : ''}`}>
                {files.map(file => (
                    <img
                        key={file.FileId}
                        src={file.Thumbnail || 'fallback-image.png'}
                        alt={file.Name}
                        title={file.Name}
                        className="gallery-image"
                        onClick={() => GetSTLPath(file.FilePath)}
                    />
                ))}
            </div>

            {/* Botões de navegação */}
            <div className="button-container">
                <button
                    className="navButtonGrid prevButton"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                >
                    <IoChevronBack />
                </button>
                <button
                    className="navButtonGrid nextButton"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!hasNextPage || isLoading}
                >
                    <IoChevronForward />
                </button>
            </div>

            {/* Modal */}
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
}

Grid.propTypes = {
    updateFileList: PropTypes.bool.isRequired,
    setUpdateFileList: PropTypes.func.isRequired,
    hasPathBySearchBar: PropTypes.bool.isRequired,
    setHasPathBySearchBar: PropTypes.func.isRequired,
    pathToOpen: PropTypes.string
};

export default Grid;