import './Calendar.css'
import { useState } from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Calendar = () => {

    const generateDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = generateDays(currentYear, currentMonth);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="CalendarContainer">
            <header className="CalendarHeader">
                <button className="buttonChangeMonth" onClick={handlePreviousMonth}>
                    <IoChevronBack className = "IconChangeMonth" />
                </button>
                <h2>{`${monthNames[currentMonth]} ${currentYear}`}</h2>
                <button className="buttonChangeMonth" onClick={handleNextMonth}>
                    <IoChevronForward className="IconChangeMonth" />
                </button>
            </header>
            <div className="CalendarGrid">
        {weekDays.map((day, index) => (
          <div key={index} style={{ fontWeight: 'bold' }}>{day}</div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              backgroundColor: day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? '#add8e6' : '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
