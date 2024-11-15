import './App.css';
import { useState } from 'react';
import HomePage from './assets/HomePage';

import LoginForm from './assets/Components/LoginForm/LoginForm';
import NotebookComponent from './assets/Components/NotebookComponent/NotebookComponent';
import LoginHeader from './assets/Components/LoginHeader/LoginHeader';
import TextLogin from './assets/Components/TextLogin/TextLogin';

function App() {
    const [page, setPage] = useState('homePage');
    const [loginType, setLoginType] = useState('Anonymous');
    const [user, setUser] = useState(null);

    const pageIsLogin = page === 'login' ? true : false;

    return (
        <div>
            <div className={pageIsLogin ?  "backgroundLogin" : ''}>
                {pageIsLogin && (
                    <><LoginHeader /><TextLogin /></>
                )}

                <HomePage setPage={setPage} page={page} loginType={loginType} user={user} setUser={setUser} />

                {pageIsLogin && (
                    <><NotebookComponent /><LoginForm setPage={setPage} setLoginType={setLoginType} setUser={setUser} /></>
                )}
                </div>

        </div>
    ); 
}

export default App;
