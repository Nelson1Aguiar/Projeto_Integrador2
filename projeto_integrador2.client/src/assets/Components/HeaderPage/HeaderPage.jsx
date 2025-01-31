import './HeaderPage.css';
import PropTypes from 'prop-types';
import SearchBar from '../SearchBar/SearchBar';
import UserDropBox from '../UserDropBox/UserDropBox';
import { useEffect, useState } from 'react';

const HeaderPage = ({ setPage, loginType, user, setUser, files, setHasPathBySearchBar, setPathToOpen }) => {
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
            <div className='imgLexim'>
                <img src="src\assets\Icons\noname.png" alt="Lexim.Symbol.Header" />
                <h1>Lexim</h1>
            </div>
            
            <SearchBar files={files} setHasPathBySearchBar={setHasPathBySearchBar} setPathToOpen={setPathToOpen} />
         
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
    setHasPathBySearchBar: PropTypes.func.isRequired,
    setPathToOpen: PropTypes.func.isRequired,
    files: PropTypes.array,

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
