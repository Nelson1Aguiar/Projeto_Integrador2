import './NoticeBoard.css';
import Suggestions from './Suggestions/Suggestions.jsx'
import EventsCalendar from './Calendar/EventsCalendar.jsx'
import { useState } from 'react'
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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
                    <Suggestions />
                )}
                {currentDisplay === "calendar" && (
                    <EventsCalendar />
                )}
            </div>
            <button className="navButton nextButton" onClick={verifyNextDisplay}>
                <IoChevronForward />
            </button>
        </div>
    );
};

export default NoticeBoard;