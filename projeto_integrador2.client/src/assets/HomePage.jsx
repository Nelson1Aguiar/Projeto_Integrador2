import './HomePage.css'
import { useState, useEffect } from 'react';
import Header from './Components/HeaderPage/HeaderPage'
import NoticeBoard from './Components/NoticeBoard/NoticeBoard'
import Grid from './Components/Grid/Grid';
import Footer from './Components/Footer/Footer'
import PropTypes from 'prop-types';

const HomePage = ({ setPage, page, loginType, user, setUser }) => {

    const [scaled, setScaled] = useState(false);

    useEffect(() => {
        if (page === 'login') {
            setScaled(true);
        } else {
            setScaled(false);
        }
    }, [page]);

    return (
        <div id="containerHomePage" className={`homePage ${scaled ? 'changeScale' : ''}`}>
            <Header setPage={setPage} page={page} loginType={loginType} user={user} setUser={setUser} />
            <NoticeBoard />
            <Grid page={page} />
            {page === "homePage" && (
                <Footer />
            )}
        </div>
    )
}

HomePage.propTypes = {
    setPage: PropTypes.func.isRequired,
    page: PropTypes.string,
    loginType: PropTypes.string,
    setUser: PropTypes.func.isRequired,

    user: PropTypes.oneOfType([
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
        }),
        PropTypes.null
    ])
};

export default HomePage;