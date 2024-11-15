import './App.css';
import { useState } from 'react';
import HomePage from './assets/HomePage';

import Background from './assets/Components/Background/Background';
import LoginForm from './assets/Components/LoginForm/LoginForm';

function App() {
    const [page, setPage] = useState('login');

    return (
        <div>
            {page === 'homePage' && (
                <HomePage setPage={setPage} page={page} />
            )}

            {page === 'login' && (
                <div className="container">
                    <LoginForm />
                </div>
            )}

        </div>
    ); 
}

export default App;
