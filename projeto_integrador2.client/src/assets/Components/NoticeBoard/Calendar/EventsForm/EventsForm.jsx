import { useState, useEffect } from 'react';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import './EventsForm.css'; 
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";
import { pt } from 'date-fns/locale';

const EventsForm = ({ setShowCalendar, setShowSelectionForm, setEvents, actionEvent, updateEvent }) => {
    const [eventName, setEventName] = useState('');
    const [eventLocal, setEventLocal] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [label, setLabel] = useState({});
    const [requiredField, setRequiredField] = useState(true);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    useEffect(() => {
        if (actionEvent === 'edit') {
            setLabel({
                Title: "Atualizar Evento",
                ButtonText: "Atualizar"
            })
            setEventName(updateEvent.title);
            setEventLocal(updateEvent.location);
            setEventDescription(updateEvent.description);
            setRequiredField(false);
            setDateRange([{
                startDate: updateEvent.start,
                endDate: updateEvent.end,
                key: "selection",
            }]);
        }
        else {
            setLabel({
                Title: "Agendar Evento",
                ButtonText: "Agendar"
            })
            setRequiredField(true);
        }
    }, [actionEvent]);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (actionEvent === 'edit')
            editEvent()
        else
            createEvent()
    }

    const createEvent = async () => {

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

        const request =
        {
            Title: eventName,
            Description: eventDescription.trim() != '' ? eventDescription : null,
            Location: eventLocal.trim() != '' ? eventLocal : null,
            StartDate: startDate,
            EndDate: endDate,
            CreateUserId: decodedToken.userId
        }

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
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    alert(errorMessages.join('\n'));
                } else if (data.message) {
                    alert(data.message);
                }
                throw new Error(data.message || 'Erro desconhecido');
            }

            const event =
            {
                title: request.Title,
                start: request.StartDate,
                end: request.EndDate,
                description: request.Description,
                location: request.Location,
                eventId: data.id,
            };

            alert("Evento criado com sucesso!");
            setEvents(prevEvents => [...prevEvents, event]);
        } catch (error) {
            console.error('ERRO: ', error);
        }
    };

    const editEvent = async () => {
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.log("Token não encontrado na sessão");
            alert("Não foi possível editar evento, tente novamente mais tarde");
            return;
        }

        const request =
        {
            Title: eventName != null && eventName.trim() != '' ? eventName : updateEvent.title,
            Description: eventDescription != null && eventDescription.trim() != '' ? eventDescription : null,
            Location: eventLocal != null && eventLocal.trim() != '' ? eventLocal : null,
            StartDate: startDate,
            EndDate: endDate,
            EventId: updateEvent.eventId
        }

        const apiUrlUpdateEvent = import.meta.env.VITE_API_URL_UPDATE_EVENT;

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        };

        try {
            const response = await fetch(apiUrlUpdateEvent, options);
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

            const event =
            {
                title: request.Title,
                start: request.StartDate,
                end: request.EndDate,
                description: request.Description,
                location: request.Location,
                eventId: request.EventId,
            };

            setEvents((prevEvents) =>
                prevEvents.map((ev) =>
                    ev.eventId === event.eventId ? { ...ev, ...event } : ev
                )
            );

            alert("Evento atualizado com sucesso!");
        } catch (error) {
            console.error('ERRO: ', error);
        }
    }

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
                <h2>{label.Title}</h2>
                <label className='containerEventsFormLabel' htmlFor="eventName">Nome do Evento*</label>
                <input
                    className='containerEventsFormInput'
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Digite o nome do evento"
                    required = {requiredField}
                />

                <label className='containerEventsFormLabel' htmlFor='eventLocal'>Local do Evento</label>
                <input 
                    className='containerEventsFormInput'
                    type='text'
                    id='eventLocal'
                    value={eventLocal}
                    onChange={(e) => setEventLocal(e.target.value)}
                    placeholder="Digite o local do evento"              
                />

                <label className='containerEventsFormLabel' htmlFor="eventDescription">Descrição do evento</label>
                <input 
                    className='containerEventsFormInput'
                    type="text"
                    id='eventDescription'
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder='Digite uma descrição sobre o evento'
                />

                    <div className="button-group">
                        <button type="submit" className="btn-submit">{label.ButtonText}</button>
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
    setEvents: PropTypes.func.isRequired,
    actionEvent: PropTypes.string.isRequired,
    updateEvent: PropTypes.oneOfType([
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            start: function (props, propName, componentName) {
                if (!(props[propName] instanceof Date)) {
                    return new Error(
                        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a Date object.`
                    );
                }
            },
            end: function (props, propName, componentName) {
                if (!(props[propName] instanceof Date)) {
                    return new Error(
                        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a Date object.`
                    );
                }
            },
            eventId: PropTypes.number.isRequired,
            description: PropTypes.string,
            location: PropTypes.string,
        }),
        PropTypes.oneOf([null]),
    ]),
};

export default EventsForm;
