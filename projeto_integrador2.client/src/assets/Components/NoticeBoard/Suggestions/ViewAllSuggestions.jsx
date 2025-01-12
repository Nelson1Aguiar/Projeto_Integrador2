import './ViewAllSuggestions.css';
import { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";

function ViewAllSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetAllSuggestions();

        const intervalId = setInterval(() => {
            GetAllSuggestions();
        }, 300000);

        return () => clearInterval(intervalId);
    }, []);

    const GetAllSuggestions = async () => {
        setLoading(true);
        const apiUrlGetAllSuggestions = import.meta.env.VITE_API_URL_GET_ALL_SUGGESTIONS;
        const token = sessionStorage.getItem('token');

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch(apiUrlGetAllSuggestions, options);
            const data = await response.json();

            if (!response.ok) {
                const message = data.message || 'Erro desconhecido';
                alert(message);
                throw new Error(message);
            }

            const mappedSuggestions = data.suggestions.map(item => ({
                suggestion: item.suggestionToSend,
                email: item.email,
                suggestionId: item.suggestionId,
            }));

            setSuggestions(mappedSuggestions);
        } catch (error) {
            console.error('ERRO: ', error);
        } finally {
            setLoading(false);
        }
    };

    const DeleteSuggestion = async (suggestionId) => {
        const apiUrlDeleteSuggestion = import.meta.env.VITE_API_URL_DELETE_SUGGESTION;
        const token = sessionStorage.getItem('token');

        if (!token) {
            alert("Não foi possível realizar a ação, tente novamente mais tarde.");
            return;
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify( suggestionId ),
        };

        try {
            const response = await fetch(apiUrlDeleteSuggestion, options);
            const data = await response.json();

            if (!response.ok) {
                const message = data.message || 'Erro desconhecido';
                alert(message);
                throw new Error(message);
            }

            alert('Sugestão excluída com sucesso!');
            setSuggestions((prevSuggestions) =>
                prevSuggestions.filter((suggestion) => suggestion.suggestionId !== suggestionId)
            );
        } catch (error) {
            console.error('Erro ao deletar sugestão:', error);
        }
    };

    return (
        <div className="mainContainerSuggestions">
            <h1 className="titleSuggestions">Sugestões</h1>
            <ul className="listSuggestions">
                {suggestions.map((item) => (
                    <li className="suggestionContainerItemList" key={item.suggestionId}>
                        <div className="suggestionContainer">
                            <div className="userContainer">
                                <IoPersonCircleOutline className="userIcon" />
                                <h2>{item.email}</h2>
                            </div>
                            <div className="textSuggestionsContainer">
                                <p>{item.suggestion}</p>
                            </div>
                        </div>
                        <button
                            title="Excluir"
                            className="deleteSuggestionButton"
                            onClick={() => DeleteSuggestion(item.suggestionId)}
                        >
                            <FaTrash className="deleteSuggestionIcon" />
                        </button>
                    </li>
                ))}
            </ul>
            <button
                className="refresh-button updateSuggestion"
                onClick={GetAllSuggestions}
                disabled={loading}
            >
                {loading ? <div className="spinner"></div> : 'Atualizar'}
            </button>
        </div>
    );
}

export default ViewAllSuggestions;
