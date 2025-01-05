import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './EventsCalendar.css'
import { useEffect, useState } from 'react';

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Nenhum evento neste período.',
    showMore: (count) => `+ Ver mais (${count})`,
};

const EventsCalendar = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const GetAllEvents = async () => {
        setLoading(true);
        const apiUrlGetAllEvents = import.meta.env.VITE_API_URL_GETALLEVENTS;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        try {
            const response = await fetch(apiUrlGetAllEvents, options);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                throw new Error(data.message);
            }

            const mappedEvents = data.events.map(event => ({
                title: event.title,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                description: event.description,
                location: event.location
            }));

            setEvents(mappedEvents);
        }
        catch (error) {
            console.error('ERRO: ', error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetAllEvents();

        const intervalId = setInterval(() => {
            GetAllEvents();
        }, 300000);

        return () => clearInterval(intervalId);
    }, []);

    const eventComponent = ({ event }) => (
        <div>
            <strong>{event.title}</strong><br />
            <small>Descrição: {event.description}</small><br />
            <small>Local: {event.location}</small>
        </div>
    );


    return (
        <div className="containerCalendar">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="pt-BR"
                messages={messages}
                className="calendarComponent"
                components={{
                    event: eventComponent
                }}
            />
            <button
                className="refresh-button"
                onClick={GetAllEvents}
                disabled={loading}
            >
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    'Atualizar'
                )}
            </button>
        </div>
    );
};

export default EventsCalendar;
