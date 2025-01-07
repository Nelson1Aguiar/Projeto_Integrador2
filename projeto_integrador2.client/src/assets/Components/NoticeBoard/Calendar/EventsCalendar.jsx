import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './EventsCalendar.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash, FaEdit } from "react-icons/fa";
import SelectionForm from '../../../SelectionForm';

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

const EventsCalendar = ({ loginType }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('month');
    const [showCalendar, setShowCalendar] = useState(false); // Estado para controlar a exibição do calendário

    const GetAllEvents = async () => {
        setLoading(true);
        const apiUrlGetAllEvents = import.meta.env.VITE_API_URL_GETALLEVENTS;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

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
                location: event.location,
                eventId: event.eventId,
            }));

            setEvents(mappedEvents);
        } catch (error) {
            console.error('ERRO: ', error);
        } finally {
            setLoading(false);
        }
    };

    const DeleteEvent = async (eventId) => {
        const apiUrlDeleteEvent = import.meta.env.VITE_API_URL_DELETE_EVENT;
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error("Token não encontrado.");
            return;
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: eventId,
        };

        try {
            const response = await fetch(apiUrlDeleteEvent, options);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                throw new Error(data.message);
            }

            setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
        }
    };

    useEffect(() => {
        if (showCalendar) {
            GetAllEvents();
        }
        const intervalId = setInterval(() => {
            if (showCalendar) {
                GetAllEvents();
            }
        }, 300000);

        return () => clearInterval(intervalId);
    }, [showCalendar]);

    const eventComponent = ({ event }) => (
        <>
            {view !== 'agenda' && (
                <div style={{ width: '100%' }}>
                    <strong style={{ fontSize: '0.7rem' }}>{event.title}</strong><br />
                </div>
            )}
            {view === 'agenda' && (
                <div className="containerEventsInformations">
                    <div className="containerTextInformations">
                        <strong>{event.title}</strong><br />
                        <small>Descrição: {event.description}</small><br />
                        <small>Local: {event.location}</small>
                    </div>
                    {loginType === 'Authenticated' && (
                        <div className="containerButtonsActionsEvents">
                            <button className="buttonDeleteEvent" title="Excluir" onClick={() => DeleteEvent(event.eventId)}><FaTrash /></button>
                            <button className="buttonEditEvent" title="Editar"><FaEdit /></button>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    const handleEventSelect = () => {
        setView('agenda');
    };

    return (
        <div className="containerCalendar">
            {/* Exibe o calendário apenas se showCalendar for true */}
            {showCalendar && (
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
                    onView={setView}
                    onSelectEvent={handleEventSelect}
                    view={view}
                />
            )}

            {/* Botão para exibir o calendário */}
            <button onClick={() => setShowCalendar(!showCalendar)}>
                {showCalendar ? 'Agendar evento' :'Fechar Calendário' }
                {showCalendar && <SelectionForm />}
            </button>
            

            {/* Botão de atualização */}
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

EventsCalendar.propTypes = {
    loginType: PropTypes.string,
};

export default EventsCalendar;
