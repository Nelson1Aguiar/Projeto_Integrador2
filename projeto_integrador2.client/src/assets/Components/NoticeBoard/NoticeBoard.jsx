import './NoticeBoard.css';
import Suggestions from './Suggestions/Suggestions.jsx';
import EventsCalendar from './Calendar/EventsCalendar.jsx';
import ViewAllSuggestions from './Suggestions/ViewAllSuggestions.jsx';
import SendFiles from './SendFiles/SendFiles.jsx'
import { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import PropTypes from 'prop-types';

const NoticeBoard = ({ loginType }) => {
    const [currentDisplay, setCurrentDisplay] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        if (loginType === 'Authenticated')
            setLastPage(3);
        else
            setLastPage(1);
    }, [loginType]);

    const allowChangeForNextDisplay = currentDisplay === lastPage ? false : true;
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
                        <EventsCalendar loginType={loginType} />
                    </div>
                    {lastPage === 3 && (
                        <>
                            <div className="slide">
                                <ViewAllSuggestions />
                            </div>

                            <div className="slide">
                                <SendFiles />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <button className={`navButton nextButton ${!allowChangeForNextDisplay ? 'disabledChangeDisplay' : ''}`} onClick={nextDisplay} style={allowChangeForNextDisplay ? {} : { color: "grey", cursor: "not-allowed"}}>
                <IoChevronForward />
            </button>
        </div>
    );
};

NoticeBoard.propTypes = {
    loginType: PropTypes.string,
};

export default NoticeBoard;
