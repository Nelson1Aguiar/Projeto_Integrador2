import "./LoginForm.css"
import anonimo from './Img/anonimo.png';
import PropTypes from "prop-types"
import { jwtDecode } from "jwt-decode";

const LoginForm = ({ setPage, setLoginType, setUser}) => {

    const changePage = () => {
        setPage("homePage");
    }

    const validateLogin = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const json = Object.fromEntries(formData.entries());

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        }

        try {
            const response = await fetch('https://localhost:7106/User/Login', options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            const decodedToken = jwtDecode(data.token);

            const User = {
                Token: data.token,
                Name: decodedToken.name,
                Email: decodedToken.email,
                UserId: decodedToken.userId
            }

            changePage('homePage');
            setUser(User);
            setLoginType('Authenticated');
        }
        catch (error) {
            console.error('ERRO: ', error);
        }
    }

    return (
            <div className="containerLogin">
            <h1>Crie sua ideia!</h1>
            <form onSubmit={validateLogin} className="formLogin">
                    <label htmlFor="email">E-mail</label>
                    <input name="email" type="email" placeholder="usuario@email.com" required></input>
                    <label htmlFor="password">Senha</label>
                    <input name="password" type="password" placeholder="***********" required></input>
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
    setUser: PropTypes.func.isRequired,
    setLoginType: PropTypes.func.isRequired
};

export default LoginForm