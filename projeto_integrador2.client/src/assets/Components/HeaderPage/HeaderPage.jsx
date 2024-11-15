import './HeaderPage.css';
import PropTypes from 'prop-types';

const HeaderPage = ({ setPage, page }) => {

    const isLoginScreen = page === "login" ? true : false

    return (
        <div className = "header">
            <div className='imgUFC'>
                <img style={isLoginScreen ? { width: "15%" } : {}} src="src\assets\Components\HeaderPage\img\ufcSymbol.png" alt="UFC.Symbol.Header" />
            </div>
            <div className='searchHeader'>
                <input disabled={isLoginScreen} type="text" placeholder='Pesquisar'/>
            </div>
            <div className='signIn'>
                <button style={isLoginScreen === true ? { padding: "0%", width: "40%", backgroundColor: "#007bff" } : {}} disabled={isLoginScreen} onClick={() => setPage('login')}>
                    Login
                </button>
            </div>
        </div>
    );
}

HeaderPage.propTypes = {
    setPage: PropTypes.func.isRequired,
    page: PropTypes.string
};


export default HeaderPage;
