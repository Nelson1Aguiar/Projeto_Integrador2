import './SelectionForm.css';
import EventsForm from './Components/NoticeBoard/SelectEvent/EventsForm';
import PropTypes from 'prop-types';

const SelectionForm = ({ setPage, user }) => {
    return (
        <div className="ContainerSelectionForm">
            <EventsForm setPage={setPage} user={user} />
        </div>
    );
};

SelectionForm.propTypes = {
    setPage: PropTypes.func.isRequired,
    user: PropTypes.oneOfType([
        PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Email: PropTypes.string.isRequired,
            UserId: PropTypes.string.isRequired,
        }),
        PropTypes.oneOf([null]),
    ]),
};

export default SelectionForm;
