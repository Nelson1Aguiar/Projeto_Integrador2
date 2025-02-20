import PropTypes from 'prop-types';
import './UserDropBox.css'
import { FiChevronDown } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const UserDropBox = ({ user, setUser, setPage, fetchToken }) => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (selectedOption !== null && selectedOption.value === "2") {
            setPage("login");
            setSelectedOption(null);
            setUser(null);
            fetchToken();
        }
    }, [selectedOption, setUser, setPage]);

    const getFirstName = (user) => {
        return user.Name.split(' ')[0];
    }

    const options = [
        { value: "1", span: "Meu Perfil" },
        { value: "2", span: "Sair" },
    ];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option) => {
        setIsOpen(false);
        setSelectedOption(option);
    };

    return (
      
      <div className="custom-select" onClick={toggleDropdown}>
          <div className="selected-option">
                <img src="src\assets\Components\UserDropBox\Img\foto-do-usuario.png" />
                {user != null && (
                    <span>Bem vindo, {getFirstName(user)}</span>
                )}
              <FiChevronDown
                  className={`arrow-icon ${isOpen ? "rotate" : ""}`}
              />
          </div>
          {isOpen && (
              <ul className="options">
                  {options.map((option) => (
                    <li key={option.value}
                        onClick={() => handleSelect(option)}
                        className="option"
                      >
                          <span>{option.span}</span>
                    </li>
                  ))}
              </ul>
          )}
      </div>
  );
}

UserDropBox.propTypes = {
    setPage: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    fetchToken: PropTypes.func.isRequired,

    user: PropTypes.oneOfType([
        PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Email: PropTypes.string.isRequired,
            UserId: PropTypes.string.isRequired,
        }),
        PropTypes.oneOf([null])
    ])
};

export default UserDropBox;