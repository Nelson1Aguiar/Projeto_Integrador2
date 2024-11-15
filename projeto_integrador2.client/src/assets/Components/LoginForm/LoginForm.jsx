import "./LoginForm.css"
import anonimo from './Img/anonimo.png';
import PropTypes from "prop-types"

const LoginForm = ({ setPage, setLoginType }) => {

    const changePage = () => {
        setPage("homePage");
    }

    const validateLogin = async (event) => {
        event.preventDefault();

        const formData = new FormData(event);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData,
        }

        try {
            const response = await fetch('https://localhost:7106/User/Login',options);
            if (!response.ok) {
                throw new Error('Erro de rede');
            }
            const data = await response.json();

            const User = {
                Succes: data.Succes,
                Message: data.message,
                Token : data.Token
            }

            console.log(User)
        }
        catch (error) {
            console.error('ERRO: ', error);
        }
    }

    return (
            <div className="containerLogin">
            <h1>Crie sua ideia!</h1>
            <form onSubmit={(event) => validateLogin(event)} className="formLogin">
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
                <button onClick={() => changePage()}>
                    <img src={anonimo} />
                    Entrar como visitante
                </button>
            </div>
        </div>
    )
}

LoginForm.propTypes = {
    setPage: PropTypes.func.isRequired,
    setLoginType: PropTypes.func.isRequired
};

export default LoginForm