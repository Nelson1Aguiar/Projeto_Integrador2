import './HeaderPage.css';
import PropTypes from 'prop-types';

const HeaderPage = ({ setPage, page, loginType, user, setUser }) => {

    const isLoginScreen = page === "login" ? true : false
    const isAuthenticated = loginType === "Authenticated" ? true : false

    const getFirstName = () => {
        return user.Name.split(' ')[0];
    }

    return (
        <div className = "header">
            <div className='imgUFC'>
                <img style={isLoginScreen ? { width: "15%" } : {}} src="src\assets\Components\HeaderPage\img\ufcSymbol.png" alt="UFC.Symbol.Header" />
            </div>
            <div className='searchHeader'>
                <input disabled={isLoginScreen} type="text" placeholder='Pesquisar'/>
            </div>
            <div className='signIn'>
                {!isAuthenticated && (
                    <button style={isLoginScreen === true ? { padding: "0%", width: "40%", backgroundColor: "#007bff" } : {}} disabled={isLoginScreen} onClick={() => setPage('login')}>
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
    page: PropTypes.string,
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
