import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./RecentCar.css";

function RecentCar() {
  const [recentCar, setRecentCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Fetch the most recent car
  useEffect(() => {
    const fetchRecentCar = async () => {
      try {
        const response = await fetch("https://carvision.onrender.com/api/available-cars");
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentCar(sortedData[0]); // Get the most recent car
      } catch (error) {
        console.error("Error fetching recent car:", error);
      }
    };

    fetchRecentCar();
  }, []);

  // Handle image slide navigation
  const handleNextImage = useCallback(() => {
    if (recentCar && recentCar.pictures) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % Math.min(recentCar.pictures.length, 5));
    }
  }, [recentCar]);

  const handlePreviousImage = () => {
    if (recentCar && recentCar.pictures) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + Math.min(recentCar.pictures.length, 5)) % Math.min(recentCar.pictures.length, 5)
      );
    }
  };

  // Automatic sliding for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextImage();
    }, 5000); // Slide every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [handleNextImage]);

  // Handle swipe for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const endX = e.touches[0].clientX;
    if (startX - endX > 50) {
      handleNextImage();
      setIsDragging(false);
    } else if (endX - startX > 50) {
      handlePreviousImage();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!recentCar) {
    return <div className="recent-car-loading">Loading recent car...</div>;
  }

  return (
    <section className="recent-car-section">
      <h2 className="recent-car-title">Recent Car Added</h2>
      <div
        className="recent-car-slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {recentCar.pictures && recentCar.pictures.length > 0 ? (
          <Link to={`/cardetails/${recentCar.id}`}>
            <img
              src={recentCar.pictures[currentImageIndex]}
              alt={`Recent Car ${currentImageIndex + 1}`}
              className="recent-car-image"
            />
          </Link>
        ) : (
          <p>No images available</p>
        )}
        <div className="dots-container">
          {recentCar.pictures &&
            recentCar.pictures.slice(0, 5).map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
              ></span>
            ))}
        </div>
      </div>
      <div className="recent-car-info">
        <Link to={`/cardetails/${recentCar.id}`} className="recent-car-link">
          <h2 className="recent-car-name">{recentCar.make}</h2>
          <p className="recent-car-year">{recentCar.year}</p>
        </Link>
      </div>
    </section>
  );
}

export default RecentCar;