import './HomePage.css'
import { useState, useEffect } from 'react';
import Header from './Components/HeaderPage/HeaderPage'
import NoticeBoard from './Components/NoticeBoard/NoticeBoard'
import Grid from './Components/Grid/Grid';
import Footer from './Components/Footer/Footer'
import PropTypes from 'prop-types';

const HomePage = ({ setPage, page, loginType, user, setUser, fetchToken }) => {

    const [scaled, setScaled] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [updateFileList, setUpdateFileList] = useState(false);
    const [hasPathBySearchBar, setHasPathBySearchBar] = useState(false);
    const [pathToOpen, setPathToOpen] = useState("");

    const GetAllFilesNames = async () => {
        const apiUrlGetAllFilesNames = import.meta.env.VITE_API_URL_GET_ALL_FILES_NAMES;

        try {

            const token = sessionStorage.getItem('token');

            if (!token) {
                console.error("Token não encontrado.");
                return;
            }

            const response = await fetch(apiUrlGetAllFilesNames, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro desconhecido");
            }

            if (data.files.length > 0) {
                const mappedFiles = data.files.map(file => ({
                    FileId: file.fileId,
                    Name: file.name,
                    FilePath: file.filePath
                }));

                setFileList(mappedFiles);
            }
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
        }
    }

    useEffect(() => {
        GetAllFilesNames()
    }, [updateFileList]);

    useEffect(() => {
        const fetchFileNames = async () => {
            try {
                await GetAllFilesNames();
            } catch (error) {
                console.error("Erro ao buscar nomes dos arquivos:", error);
            }
        };

        fetchFileNames();
        const intervalId = setInterval(fetchFileNames, 300000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (page === 'login') {
            setScaled(true);
        } else {
            setScaled(false);
        }
    }, [page]);

    return (
        <div id="containerHomePage" className={`homePage ${scaled ? 'changeScale' : ''}`}>
            <Header setPage={setPage} loginType={loginType} user={user} setUser={setUser} files={fileList} setHasPathBySearchBar={setHasPathBySearchBar} setPathToOpen={setPathToOpen} fetchToken={fetchToken} />
            <NoticeBoard loginType={loginType} setFiles={setFileList} setUpdateFileList={setUpdateFileList} />
            <Grid page={page} updateFileList={updateFileList} setUpdateFileList={setUpdateFileList} hasPathBySearchBar={hasPathBySearchBar} setHasPathBySearchBar={setHasPathBySearchBar} pathToOpen={pathToOpen} />
            <Footer />
        </div>
    )
}

HomePage.propTypes = {
    setPage: PropTypes.func.isRequired,
    page: PropTypes.string,
    loginType: PropTypes.string,
    setUser: PropTypes.func.isRequired,
    fetchToken: PropTypes.func.isRequired,

    user: PropTypes.oneOfType([
        PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Email: PropTypes.string.isRequired,
            UserId: PropTypes.string.isRequired,
        }),
        PropTypes.oneOf([null])
    ])
};

export default HomePage;