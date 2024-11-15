import "./LoginForm.css"
import anonimo from './Img/anonimo.png';

const LoginForm = () => {
    return (
            <div className="containerLogin">
                <h1>Crie sua ideia!</h1>
                <form className="formLogin">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" type="email" placeholder="usuario@email.com" required></input>
                    <label htmlFor="password">Senha</label>
                    <input id="password" type="password" placeholder="***********" required></input>
                    <a>Esqueceu a senha?</a>
                    <button type="submit">Sign In</button>
                </form>
                <div className = "divider">
                    <span>ou</span>
                </div>

            <div className="defaultAccess">
                <button>
                    <img src={anonimo}/>
                    Entrar como visitante
                </button>
            </div>
        </div>
    )
}

export default LoginForm