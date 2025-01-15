import { useState } from "react";

function SendFiles() {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !name) {
            alert("Por favor, selecione um arquivo e defina um nome.");
            return;
        }

        const apiUrlUploadFile = import.meta.env.VITE_API_URL_UPLOAD_FILE;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);

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
            body: formData
        };

        try {

            const response = await fetch(apiUrlUploadFile, options);
            const data = await response.json();

            if (!response.ok) {
                const message = data.message || "Erro desconhecido";
                alert(message);
                throw new Error(message);
            }

            alert("Arquivo enviado com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar o arquivo:", error);
            alert("Ocorreu um erro ao enviar o arquivo.");
        }
    };

    return (
        <div className="containerSendFile">
            <h2>Envio de Arquivo 3D</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="file">Selecione o arquivo STL:</label>
                    <input
                        type="file"
                        id="file"
                        accept=".stl"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <label htmlFor="name">Defina um nome:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Nome do arquivo"
                    />
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default SendFiles;
