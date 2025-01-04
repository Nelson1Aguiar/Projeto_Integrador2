import './NoticeBoard.css';
import Calendar from './Calendar/Calendar.jsx'
import { useState } from 'react'
import { IoSend, IoChevronBack, IoChevronForward } from "react-icons/io5";

const NoticeBoard = () => {

    const [currentDisplay, setCurrentDisplay] = useState("suggestion");

    const verifyNextDisplay = () => {
        switch (currentDisplay) {
            case "suggestion":
                setCurrentDisplay("calendar")
                break;
            case "calendar":
                setCurrentDisplay("suggestion")
                break;
            default:
                break;
        }
    }

    return (
        <div className="noticeBoard">
            <button className="navButton prevButton" onClick={verifyNextDisplay}>
                <IoChevronBack className="prevIcon" />
            </button>
            <div className="display">
                {currentDisplay === "suggestion" && (
                    <div className="postSuggestion">
                        <div className="textContainer">
                            <h1>Transforme sua ideia em arte!</h1>
                            <h2>Envie seu projeto 3D e inspire outros a criar</h2>
                        </div>
                        <form className="suggestionForm">
                            <label htmlFor="email">E-mail</label>
                            <input type='email' name="email" placeholder="aluno@ufc.com.br" required></input>
                            <label className="labelDescricao" htmlFor="descricao">Descrição</label>
                            <input name="descricao" placeholder="Carro preto" required></input>
                            <button className="sendSuggestion" type="submit">Enviar <IoSend className="iconStyle" />
                            </button>
                        </form>
                    </div>
                )}
                {currentDisplay === "calendar" && (
                    <Calendar />
                )}
            </div>
            <button className="navButton nextButton" onClick={verifyNextDisplay}>
                <IoChevronForward />
            </button>
        </div>
    );
};

export default NoticeBoard;