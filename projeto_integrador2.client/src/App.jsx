import './App.css';
import { useState } from 'react';
import HomePage from './assets/HomePage';
import LoginPage from './assets/LoginPage';

function App() {
    const [page, setPage] = useState('homePage');
    const [loginType, setLoginType] = useState('Anonymous');
    const [user, setUser] = useState(null);

    const pageIsLogin = page === 'login' ? true : false;

    return (
        <div className="App">
            <div className={`Pages ${pageIsLogin ? 'slide-to-login' : 'slide-to-home'}`}>
                <div className="Page OverflowHomePage">
                    <HomePage setPage={setPage} page={page} loginType={loginType} user={user} setUser={setUser} />
                </div>
                <div className="Page">
                    <LoginPage setPage={setPage} setLoginType={setLoginType} setUser={setUser} />
                </div>
            </div>
        </div>
    ); 
}

export default App;
