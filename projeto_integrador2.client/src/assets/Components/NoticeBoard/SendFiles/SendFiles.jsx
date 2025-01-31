import { useState } from "react";
import './SendFiles.css';
import PropTypes from 'prop-types';

function SendFiles({ setFiles, setUpdateFileList }) {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setFileName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !fileName) {
            alert("Por favor, selecione um arquivo e defina um nome.");
            return;
        }

        const apiUrlUploadFile = import.meta.env.VITE_API_URL_UPLOAD_FILE;

        const fileExtension = file.name.split('.').pop();
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const byteArrayList = Array.from(byteArray);

        const request = {
            name: fileName,
            file: byteArrayList,
            extension: fileExtension
        };

        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error("Token não encontrado.");
            alert("Não foi possível enviar arquivo, tente novamente mais tarde");
            return;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        };

        try {
            const response = await fetch(apiUrlUploadFile, options);
            const data = await response.json();

            if (!response.ok) {
                const message = data.message || "Erro desconhecido";
                alert(message);
                throw new Error(message);
            }

            const files = {
                fileName: data.name,
                fileId: data.Id
            }

            setFiles(prevFiles => [...prevFiles, files]);
            setUpdateFileList(true);
            alert("Arquivo enviado com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar o arquivo:", error);
            alert("Ocorreu um erro ao enviar o arquivo.");
        }
    };

    return (
        <div className="containerSendFile">
            <h2>Envio de Arquivo 3D</h2>
            <form onSubmit={handleSubmit} className="sendFileForm">
                <div className="inputGroup">
                    <label htmlFor="file" className="inputLabel">Selecione o arquivo STL:</label>
                    <input
                        type="file"
                        id="file"
                        accept=".stl"
                        onChange={handleFileChange}
                        className="fileInput"
                        required
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="name" className="inputLabel">Defina um nome:</label>
                    <input
                        type="text"
                        id="name"
                        value={fileName}
                        onChange={handleNameChange}
                        placeholder="Nome do arquivo"
                        className="textInput"
                        required
                    />
                </div>
                <button type="submit" className="submitButton">Enviar</button>
            </form>
        </div>
    );
}

SendFiles.propTypes = {
    loginType: PropTypes.string,
    setFiles: PropTypes.func.isRequired,
    setUpdateFileList: PropTypes.func.isRequired
};

export default SendFiles;
