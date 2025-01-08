import './HeaderPage.css';
import PropTypes from 'prop-types';
import SearchBar from '../SearchBar/SearchBar';
import UserDropBox from '../UserDropBox/UserDropBox';
import { useEffect, useState } from 'react';

const HeaderPage = ({ setPage, loginType, user, setUser }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (loginType === "Authenticated") {
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }
    }, [loginType])

    return (
        <div className = "header">
            <div className='imgUFC'>
                <img src="src\assets\Components\HeaderPage\img\ufcSymbol.png" alt="UFC.Symbol.Header" />
            </div>
            
                <SearchBar/>
         
            <div className='signIn'>
                {!isAuthenticated && (
                    <button onClick={() => setPage('login')}>
                        Login
                    </button>
                )}
                {isAuthenticated && (
                    <UserDropBox user={user} setUser={setUser} setPage={setPage} />
                )}
            </div>
        </div>
    );
}

HeaderPage.propTypes = {
    setPage: PropTypes.func.isRequired,
    loginType: PropTypes.string,
    setUser: PropTypes.func.isRequired,

    user: PropTypes.oneOfType([
        PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Email: PropTypes.string.isRequired,
            UserId: PropTypes.string.isRequired,
        }),
        PropTypes.oneOf([null])
    ])
};


export default HeaderPage;
