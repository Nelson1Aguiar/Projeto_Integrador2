import React, { useState } from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import './EventsForm.css'; 

const EventsForm = ({ setPage, user }) => {
    const [date, setDate] = useState(new Date());
    const [eventName, setEventName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        //  enviar os dados para backEnd
        console.log('Evento:', eventName, 'Data:', date, 'Usuário:', user);
        alert(`Evento "${eventName}" agendado para ${date.toDateString()}`);
    };

    return (
        <div className="EventForm">
            <h2>Agendar Evento</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="eventName">Nome do Evento:</label>
                <input
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Digite o nome do evento"
                    required
                />

                <label>Escolha uma data:</label>
                <Calendar
                    onChange={setDate}
                    value={date}
                />

                <button type="submit" className="btn-submit">Agendar</button>
                <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setPage('homePage')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EventsForm;
