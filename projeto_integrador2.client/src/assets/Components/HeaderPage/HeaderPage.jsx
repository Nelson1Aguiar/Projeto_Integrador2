import './HeaderPage.css';
import PropTypes from 'prop-types';

const HeaderPage = ({ setPage }) => {

    return (
        <div className = "header">
            <div className='imgUFC'>
                 <img src="src\assets\Components\HeaderPage\img\ufcSymbol.png" alt="UFC.Symbol.Header" />
            </div>
            <div className='searchHeader'>
                <input type="text" placeholder='Pesquisar'/>
            </div>
            <div className='signIn'>
                <button onClick={() => setPage('login')}>
                    Login
                </button>
            </div>
        </div>
    );
}

HeaderPage.propTypes = {
    setPage: PropTypes.func.isRequired,
};


export default HeaderPage;
