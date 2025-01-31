import "./LoginHeader.css"

const LoginHeader = () => {
    return (
        <div className="headerLogin">
            <div className='imgLeximForLogin'>
                <img src="src\assets\Icons\noname.png" alt="Lexim.Symbol.Header" />
                <h1>Lexim</h1>
            </div>
            <img src="src\assets\Icons\ufcSymbol.png" width="2.5%" alt="UFC.Symbol.Header" />
        </div>
    );
}

export default LoginHeader