
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import { LazyLoadImage } from "react-lazy-load-image-component"; // Import LazyLoadImage
import "react-lazy-load-image-component/src/effects/blur.css"; // Import blur effect for lazy loading
import "./Hero.css"; // Make sure to create this CSS file for styling
import Carvisioni from "../../Images/Carvisioni.jpg";
import Carvisioni1 from "../../Images/Carvisioni1.jpg";
import carvisioni2 from "../../Images/carvisioni2.jpg";
import carvisioni3 from "../../Images/carvisioni3.jpg";

function Hero() {
  const { translate } = useTranslation(); // Access the translate function

  // Memoize the slides array
  const slides = useMemo(
    () => [
      { image: Carvisioni, text: translate("Carvision: We Got Your Dream Ride") },
      { image: Carvisioni1, text: translate("Audi A5 : We Care about Your ride journey") },
      { image: carvisioni2, text: translate("Hyundai GS: We Love You") },
      { image: carvisioni3, text: translate("Volkswaggen: We Welcome You") },
    ],
    [translate] // Dependency: re-create slides only if translate changes
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  let touchStartX = 0;
  let touchEndX = 0;

  // Automatically change slides every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length]);

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
    if (touchEndX - touchStartX > 50) {
      // Swipe right
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <div
      className="hero"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-image">
        <LazyLoadImage
          src={slides[currentSlide].image}
          alt={slides[currentSlide].text}
          effect="blur" // Blur effect while loading
          className="lazy-hero-image"
        />
      </div>
      <div className="hero-text">
        <h2>{slides[currentSlide].text}</h2>
        <button className="cta-button">{translate("shopNow")}</button>
      </div>
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Hero;