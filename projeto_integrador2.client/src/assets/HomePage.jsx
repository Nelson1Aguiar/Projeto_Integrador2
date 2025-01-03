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
            <Header setPage={setPage} loginType={loginType} user={user} setUser={setUser} />
            <NoticeBoard />
            <Grid page={page} />
            <Footer />
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
            Token: PropTypes.string.isRequired,
            Name: PropTypes.string.isRequired,
            Email: PropTypes.string.isRequired,
            UserId: PropTypes.string.isRequired,
        }),
        PropTypes.oneOf([null])
    ])
};

export default HomePage;