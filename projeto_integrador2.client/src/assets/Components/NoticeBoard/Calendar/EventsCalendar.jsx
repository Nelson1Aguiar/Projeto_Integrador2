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
    const [showCalendar, setShowCalendar] = useState(true);
    const [showSelectionForm, setShowSelectionForm] = useState(false); // Estado para controlar a exibição do formulário

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

    useEffect(() => {
        if (showCalendar) {
            GetAllEvents();
        }
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

    const handleToggleCalendar = () => {
        setShowCalendar((prev) => !prev);
        setShowSelectionForm(false); // Fecha o formulário ao alternar o calendário
    };

    const handleShowForm = () => {
        setShowSelectionForm(true);
        setShowCalendar(false); // Fecha o calendário ao abrir o formulário
    };

    return (
        <div className="containerCalendar">
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
                    view={view}
                />
            )}

           
            {/* Exibe o formulário de seleção apenas se showSelectionForm for true */}
            {showSelectionForm && <SelectionForm />}

            <div className="actions">
                {/* Botão para alternar entre o calendário e o formulário */}
                
                {!showSelectionForm ? (
                    <button className='agendar-button' onClick={handleShowForm}>Agendar evento</button>
                ) : (
                    <button onClick={handleToggleCalendar}>Voltar ao Calendário</button>
                )}

                {/* Botão de atualização */}
                {showCalendar && (
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
                )}
            </div>
        </div>
    );
};

EventsCalendar.propTypes = {
    loginType: PropTypes.string,
};

export default EventsCalendar;
