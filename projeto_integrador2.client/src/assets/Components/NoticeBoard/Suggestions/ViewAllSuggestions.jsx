import './ViewAllSuggestions.css';
import { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";

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
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    alert(errorMessages.join('\n'));
                } else if (data.message) {
                    alert(data.message);
                }
                throw new Error(data.message || 'Erro desconhecido');
            }

            const mappedSuggestions = data.suggestions.map(item => ({
                suggestion: item.suggestionToSend,
                Email: item.email,
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
            console.error("Token não encontrado.");
            alert("Não foi possível  evento, tente novamente mais tarde");
            return;
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: suggestionId,
        }

        try {
            const response = await fetch(apiUrlDeleteSuggestion, options);
            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    alert(errorMessages.join('\n'));
                } else if (data.message) {
                    alert(data.message);
                }
                throw new Error(data.message || 'Erro desconhecido');
            }

            setSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => suggestion.suggestionId !== suggestionId));
        }
        catch (error) {
            console.error('Erro ao deletar sugestão:', error);
        }
    }

  return (
      <div>
          <ul>
              {suggestions.map((item, index) => (
                  <li key={index}>
                      <div>
                          <h1>{item.suggestion}</h1>
                          <button title="Excluir" onClick={() => DeleteSuggestion(item.suggestionId)}><FaTrash /></button>
                      </div>
                  </li>
              ))}
          </ul>
          <button
              className="refresh-button"
              onClick={GetAllSuggestions}
              disabled={loading}
          >
              {loading ? (
                  <div className="spinner"></div>
              ) : (
                  'Atualizar'
              )}
          </button>
      </div>
  );
}

export default ViewAllSuggestions;