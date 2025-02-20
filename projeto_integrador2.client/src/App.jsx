import './App.css';
import { useState, useEffect} from 'react';
import HomePage from './assets/HomePage';
import LoginPage from './assets/LoginPage';

function App() {
    const [page, setPage] = useState('homePage');
    const [loginType, setLoginType] = useState('Anonymous');
    const [user, setUser] = useState(null);

    const pageIsLogin = page === 'login' ? true : false;

    const fetchToken = async () => {

        const apiUrl = import.meta.env.VITE_API_URL_GET_TOKEN;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }

        try {
            const response = await fetch(apiUrl, options);
            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    alert(errorMessages.join('\n'));
                } else if (data.message) {
                    alert(data.message);
                }
                throw new Error(data.message || 'Erro desconhecido');
            }

            if (data.token)
                sessionStorage.setItem('token', data.token);
        }
        catch (error) {
            console.error('ERRO: ', error);
        }
    };

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <div className="App">
            <div className={`Pages ${pageIsLogin ? 'slide-to-login' : 'slide-to-home'}`}>
                <div className="Page OverflowHomePage">
                    <HomePage setPage={setPage} page={page} loginType={loginType} user={user} setUser={setUser} fetchToken={fetchToken} />
                </div>
                <div className="Page">
                    <LoginPage setPage={setPage} setLoginType={setLoginType} setUser={setUser} />
                </div>
            </div>
        </div>
    ); 
}

export default App;
