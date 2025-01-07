import React, { useState } from 'react';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import './EventsForm.css'; 
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";
import { pt } from 'date-fns/locale';

const EventsForm = ({ setShowCalendar, setShowSelectionForm, setEvents}) => {
    const [eventName, setEventName] = useState('');
    const [eventLocal, setEventLocal] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (eventName == null || eventName.trim() === '')
        {
            alert("É necessário dar um nome ao evento");
            return;
        }

        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.log("Token não encontrado na sessão");
            alert("Não foi possível criar evento, tente novamente mais tarde");
            return;
        }

        const decodedToken = jwtDecode(token);
        console.log(token);

        const request =
        {
            Title: eventName,
            Description: eventDescription.trim() != '' ? eventDescription : null,
            Location: eventLocal.trim() != '' ? eventLocal : null,
            StartDate: startDate,
            EndDate: endDate,
            CreateUserId: decodedToken.userId
        }

        console.log(JSON.stringify(request));

        const apiUrlCreateEvent = import.meta.env.VITE_API_URL_CREATE_EVENT;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        };

        try {
            const response = await fetch(apiUrlCreateEvent, options);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                throw new Error(data.message);
            }

            const event =
            {
                title: request.Title,
                start: request.StartDate,
                end: request.EndDate,
                description: request.Description,
                location: request.Location,
            };

            alert("Evento criado com sucesso!");
            setEvents(prevEvents => [...prevEvents, event]);
        } catch (error) {
            console.error('ERRO: ', error);
        }
    };

    const CancelInsert = () => {
        setShowCalendar(true);
        setShowSelectionForm(false);
        setEventName('');
        setEventLocal('');
        setEventDescription('');
        setDateRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
            },
        ]);
    };

    return (
        <div className="EventForm">
            <div className="containerEventsForm">
            <form onSubmit={handleSubmit}>
                <h2>Agendar Evento</h2>
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
                />

                <label htmlFor="eventDescription">Descrição do evento:</label>
                <input 
                    type="text"
                    id='eventDescription'
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder='Digite uma descrição sobre o evento'
                />

                <div className="button-group">
                    <button type="submit" className="btn-submit">Agendar</button>
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={CancelInsert}
                    >
                        Cancelar
                    </button>
                </div>
                </form>

                <div className="calendar-container">
                    <label>Escolha uma data</label>
                    <DateRange
                        editableDateInputs={true}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        className="custom-calendar"
                        locale={pt}
                    />
                </div>
            </div>
        </div>
    );
};

EventsForm.propTypes = {
    setShowCalendar: PropTypes.func.isRequired,
    setShowSelectionForm: PropTypes.func.isRequired,
    setEvents: PropTypes.func.isRequired
};

export default EventsForm;
