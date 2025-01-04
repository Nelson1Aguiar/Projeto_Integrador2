import './NoticeBoard.css';
import Suggestions from './Suggestions/Suggestions.jsx';
import EventsCalendar from './Calendar/EventsCalendar.jsx';
import { useState } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const NoticeBoard = () => {
    const [currentDisplay, setCurrentDisplay] = useState(0);

    const allowChangeForNextDisplay = currentDisplay === 1 ? false : true;
    const allowChangeForPrevDisplay = currentDisplay === 0 ? false : true;  

    const nextDisplay = () => {
        if (allowChangeForNextDisplay)
            setCurrentDisplay((prev) => (prev + 1));
    };

    const prevDisplay = () => {
        if (allowChangeForPrevDisplay)
            setCurrentDisplay((prev) => (prev - 1));
    };

    return (
        <div className="noticeBoard">
            <button className={`navButton prevButton ${!allowChangeForPrevDisplay ? 'disabledChangeDisplay' : ''}`} onClick={prevDisplay}>
                <IoChevronBack className="prevIcon" />
            </button>
            <div className="display">
                <div
                    className="displayContainer"
                    style={{
                        transform: `translateX(-${currentDisplay * 100}%)`,
                    }}
                >
                    <div className="slide">
                        <Suggestions />
                    </div>
                    <div className="slide">
                        <EventsCalendar />
                    </div>
                </div>
            </div>
            <button className={`navButton nextButton ${!allowChangeForNextDisplay ? 'disabledChangeDisplay' : ''}`} onClick={nextDisplay} style={allowChangeForNextDisplay ? {} : { color: "grey", cursor: "not-allowed"}}>
                <IoChevronForward />
            </button>
        </div>
    );
};

export default NoticeBoard;
