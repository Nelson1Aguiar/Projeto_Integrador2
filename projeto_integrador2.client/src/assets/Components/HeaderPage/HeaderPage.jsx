import './HeaderPage.css';
import PropTypes from 'prop-types';
import SearchBar from '../SearchBar/SearchBar';

const HeaderPage = ({ setPage, loginType, user, setUser }) => {

    const isAuthenticated = loginType === "Authenticated" ? true : false

    const getFirstName = () => {
        return user.Name.split(' ')[0];
    }

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
                    <h1>Bem-vindo, {getFirstName()}!</h1>
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
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
        }),
        PropTypes.null
    ])
};


export default HeaderPage;
