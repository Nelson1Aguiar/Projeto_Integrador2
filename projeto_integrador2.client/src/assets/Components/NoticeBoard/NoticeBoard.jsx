import './NoticeBoard.css';
import { IoSend } from "react-icons/io5";

const NoticeBoard = () => {
    return (
        <div className="noticeBoard">
            <div className="display">
                <div className="postSuggestion">
                    <div className = "textContainer">
                        <h1>Transforme sua ideia em arte!</h1>
                        <h2>Envie seu projeto 3D e inspire outros a criar</h2>
                    </div>
                    <form className="suggestionForm">
                        <label htmlFor="email">E-mail</label>
                        <input type = 'email' name="email" placeholder="aluno@ufc.com.br" required></input>
                        <label style={{ marginTop: "5%" }} htmlFor="descricao">Descrição</label>
                        <input name="descricao" placeholder="Carro preto" required></input>
                        <button type="submit">Enviar <IoSend className="iconStyle" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
  );
};

export default NoticeBoard;

