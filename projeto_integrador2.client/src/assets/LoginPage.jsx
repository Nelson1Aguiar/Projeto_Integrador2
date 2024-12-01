import './LoginPage.css'
import LoginForm from './Components/LoginForm/LoginForm';
import NotebookComponent from './Components/NotebookComponent/NotebookComponent';
import LoginHeader from './Components/LoginHeader/LoginHeader';
import TextLogin from './Components/TextLogin/TextLogin';
import PropTypes from 'prop-types';

const LoginPage = ({ setPage, setLoginType, setUser }) => {
    return (
        <div className = "ContainerLogin">
            <LoginHeader />
            <TextLogin />
            <NotebookComponent />
            <LoginForm setPage={setPage} setLoginType={setLoginType} setUser={setUser} />
        </div>
    )
}

LoginPage.propTypes = {
    setPage: PropTypes.func.isRequired,
    setLoginType: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
};

export default LoginPage;