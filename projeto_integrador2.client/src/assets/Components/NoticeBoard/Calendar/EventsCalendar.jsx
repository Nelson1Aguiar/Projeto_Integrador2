import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import './EventsCalendar.css'

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
    const events = [
        {
            title: 'Reunião de Equipe',
            start: new Date(2025, 0, 10, 10, 0),
            end: new Date(2025, 0, 10, 12, 0),
        },
        {
            title: 'Apresentação do Projeto',
            start: new Date(2025, 0, 15, 14, 0),
            end: new Date(2025, 0, 15, 16, 0),
        },
    ];

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
            />
        </div>
    );
};

export default EventsCalendar;
