import React, { useState } from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import './EventsForm.css'; 
import { use } from 'react';

const EventsForm = ({ setPage, user }) => {
    const [date, setDate] = useState(new Date());
    const [eventName, setEventName] = useState('');
    const [eventLocal, setEventLocal] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar os dados para o back-end
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

                <label htmlFor='eventLocal'>Local do Evento:</label>
                <input
                    type='text'
                    id='eventLocal'
                    value={eventLocal}
                    onChange={(e) => setEventLocal(e.target.value)}
                    placeholder="Digite o local do evento"
                    required                  
                />

                <label htmlFor="eventDescription">Descrição do evento:</label>
                <input 
                    type="text"
                    id='eventDescription'
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder='Digite uma descrição sobre o evento'
                    required
                />
                
                <label>Escolha uma data:</label>
                <div className="calendar-container">
                    <Calendar
                        onChange={setDate}
                        value={date}
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="btn-submit">Agendar</button>
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setPage('homePage')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventsForm;
