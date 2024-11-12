import './App.css';
import { useState } from 'react';
import HomePage from './assets/HomePage';
function App() {
    const [page, setPage] = useState('homePage');

    return (
        <div>
            {page === 'homePage' && (
                <HomePage setPage={setPage} page={page} />
            )}

            {page === 'login' && (
                <div>
                    <HomePage setPage={setPage} page={page} />
                </div>
            )}

        </div>
    ); 
}

export default App;
