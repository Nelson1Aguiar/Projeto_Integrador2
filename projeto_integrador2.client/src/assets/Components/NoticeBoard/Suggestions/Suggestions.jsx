import './Suggestions.css'
import { IoSend } from "react-icons/io5";

const Suggestions = () => {

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = new FormData(form);

        const formObject = Object.fromEntries(formData.entries());

        const apiUrl = import.meta.env.VITE_API_URL_SEND_SUGGESTION;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        }

        console.log(options.body);

        try {
            const response = await fetch(apiUrl, options);
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

            form.reset();
            alert("Sugestão enviada");

        } catch (error) {
            console.error("Erro:", error);
        }
    };

  return (
      <div className="postSuggestion">
          <div className="textContainer">
              <h1>Transforme sua ideia em arte!</h1>
              <h2>Envie seu projeto 3D e inspire outros a criar</h2>
          </div>
          <form className="suggestionForm" onSubmit={(event) => handleSubmit(event)}>
              <label htmlFor="Email">E-mail</label>
              <input type='email' name="Email" placeholder="aluno@ufc.com.br" required></input>
              <label className="labelDescricao" htmlFor="SuggestionToSend">Descrição</label>
              <input name="SuggestionToSend" placeholder="Carro preto" required></input>
              <button className="sendSuggestion" type="submit">Enviar <IoSend className="iconStyle" />
              </button>
          </form>
      </div>
  );
}

export default Suggestions;