import "./NotebookComponent.css"
import NotebookImage from "./Img/telaNote.png"
import HomePageImage from "./Img/Modelo.png"

const NotebookComponent = () => {
    return (
        <div className = "ContainerNotebook">
            <img src={NotebookImage} />

            <div className="ScreenContent">
                <img src={HomePageImage} />
            </div>

        </div>
    )
}

export default NotebookComponent