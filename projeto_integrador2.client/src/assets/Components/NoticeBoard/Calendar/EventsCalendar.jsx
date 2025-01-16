
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './EventsCalendar.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash, FaEdit } from "react-icons/fa";
import EventsForm from './EventsForm/EventsForm.jsx';

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
    const [showCalendar, setShowCalendar] = useState(true);
    const [showSelectionForm, setShowSelectionForm] = useState(false);
    const [actionEvent, setActionEvent] = useState('create');
    const [updateEvent, setUpdateEvent] = useState({});
    const [isMobile, setIsMobile] = useState(false);  // Novo estado para detectar dispositivos móveis
    const [showNavigation, setShowNavigation] = useState(false); // Controlar a visibilidade da navegação

    // Detecta se o dispositivo é mobile
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768); // Ajuste conforme necessário
        };

        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

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
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    alert(errorMessages.join('\n'));
                } else if (data.message) {
                    alert(data.message);
                }
                throw new Error(data.message || 'Erro desconhecido');
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
            alert("Não foi possível excluir o evento, tente novamente mais tarde");
            return;
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: eventId,
        }

        try {
            const response = await fetch(apiUrlDeleteEvent, options);
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

            setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
        }
        catch (error) {
            console.error('Erro ao deletar evento:', error);
        }
    };

    useEffect(() => {
        GetAllEvents();
        const intervalId = setInterval(() => {
            GetAllEvents();
        }, 300000);

        return () => clearInterval(intervalId);
    }, []);

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
                        {event.description != null &&
                            <small>Descrição: {event.description}</small>
                        }
                        {event.location != null && (
                            <>
                                <br />
                                <small>Local: {event.location}</small>
                            </>
                        )}
                    </div>
                    {loginType === 'Authenticated' && (
                        <div className="containerButtonsActionsEvents">
                            <button className="buttonDeleteEvent" title="Excluir" onClick={() => DeleteEvent(event.eventId)}><FaTrash /></button>
                            <button className="buttonEditEvent" title="Editar" onClick={() => handleEditEvent(event)}><FaEdit /></button>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    const handleShowForm = () => {
        setShowSelectionForm(true);
        setShowCalendar(false);
    };

    const handleEditEvent = (event) => {
        setUpdateEvent(event);
        setActionEvent('edit');
        handleShowForm();
    };

    const handleCreateEvent = () => {
        setActionEvent('create');
        handleShowForm();
    };

    const handleEventSelect = () => {
        setView('agenda');
    };

    return (
        <>
            {showCalendar && (
                <div className="containerCalendar">
                    {/* Calendário */}
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
                        onSelectEvent={handleEventSelect}
                        onView={setView}
                        view={view}
                    />

                    {/* Botão para exibir a navegação em dispositivos móveis 
                    {isMobile && (
                        <div className="calendar-navigation">
                            <button onClick={() => setShowNavigation(!showNavigation)}>
                                Navegação
                            </button>
                            {showNavigation && (
                                <div className="navigation-content">
                                    <button onClick={() => setView('month')}>Mês</button>
                                    <button onClick={() => setView('week')}>Semana</button>
                                    <button onClick={() => setView('day')}>Dia</button>
                                    <button onClick={() => setView('agenda')}>Agenda</button>
                                </div>
                            )}
                        </div>
                    )}
                    */}
                    <div className="actions">
                        {loginType === 'Authenticated' && <button className='agendar-button' onClick={handleCreateEvent}>Agendar evento</button> }
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
                </div>
            )}

            {showSelectionForm && <EventsForm setShowCalendar={setShowCalendar} setShowSelectionForm={setShowSelectionForm} setEvents={setEvents} actionEvent={actionEvent} updateEvent={updateEvent} />}
        </>
    );
};

EventsCalendar.propTypes = {
    loginType: PropTypes.string,
};

export default EventsCalendar;
