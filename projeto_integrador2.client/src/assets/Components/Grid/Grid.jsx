import "./Grid.css";
import  { useState } from 'react';

const Grid = () => {
  const imagens = [
    "src/assets/Components/Grid/Img/1.png",
    "src/assets/Components/Grid/Img/2.png",
    "src/assets/Components/Grid/Img/3.png",
    "src/assets/Components/Grid/Img/4.png",
    "src/assets/Components/Grid/Img/5.png",
    "src/assets/Components/Grid/Img/6.png",
  ];

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
        <button onClick={handlePrevious} disabled={currentIndex === 0}>Anterior</button>
        <button onClick={handleNext} disabled={currentIndex + imagesPerPage >= imagens.length}>Próxima</button>
      </div>
    </div>
  );
};

export default Grid;

