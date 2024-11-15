import "./Grid.css";
import { useState } from 'react';
import PropTypes from "prop-types"

const Grid = ({page}) => {
  const imagens = [
    "src/assets/Components/Grid/Img/1.png",
    "src/assets/Components/Grid/Img/2.png",
    "src/assets/Components/Grid/Img/3.png",
    "src/assets/Components/Grid/Img/4.png",
    "src/assets/Components/Grid/Img/5.png",
    "src/assets/Components/Grid/Img/6.png",
    ];

  const buttonStyle = page === "login" ? { padding: "2% 3%", marginBottom: "13%", backgroundColor: "#007bff" } : {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesPerPage = 4;

  const handleNext = () => {
    if (currentIndex + imagesPerPage < imagens.length) {
      setCurrentIndex(currentIndex + imagesPerPage);
    }
  };

  const handlePrevious = () => {
    if (currentIndex - imagesPerPage >= 0) {
      setCurrentIndex(currentIndex - imagesPerPage);
    }
  };

  return (
    <div className="gallery-container">
      <div className="image-grid">
        {imagens.slice(currentIndex, currentIndex + imagesPerPage).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Imagem ${currentIndex + index + 1}`}
            className="gallery-image"
          />
        ))}
      </div>
      <div className="button-container">
              <button style={buttonStyle} onClick={handlePrevious} disabled={currentIndex === 0 || page === "login"}>Anterior</button>
              <button style={buttonStyle} onClick={handleNext} disabled={currentIndex + imagesPerPage >= imagens.length || page === "login"}>Próxima</button>
      </div>
    </div>
  );
};

Grid.propTypes = {
    page: PropTypes.string
};

export default Grid;

