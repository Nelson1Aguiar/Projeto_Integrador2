import './HeaderPage.css';

const HeaderPage = () => {

    return (
        <div className = "header">
            <div className='imgUFC'>
                 <img src="src\assets\Components\HeaderPage\img\ufcSymbol.png" alt="UFC.Symbol.Header" />
            </div>
            <div className='searchHeader'>
                <input type="text" placeholder='Pesquisar'/>
            </div>
            <div className='signIn'>
                <button>
                    Login
                </button>
            </div>
        </div>
    );
}

export default HeaderPage;
