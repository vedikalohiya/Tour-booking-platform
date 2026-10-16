import { useState } from "react";
import "../styles/ImageGallery.css";

function ImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery">
        <img
          src="https://via.placeholder.com/400x300?text=No+Image"
          alt="No image"
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div className="gallery-main">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button className="gallery-prev" onClick={goToPrevious}>
              ❮
            </button>
            <button className="gallery-next" onClick={goToNext}>
              ❯
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="gallery-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
