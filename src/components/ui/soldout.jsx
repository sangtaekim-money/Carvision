import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./soldout.css";

function SoldOut() {
  const [soldOutCars, setSoldOutCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
   const fetchSoldOutCars = async () => {
  try {
   const response = await fetch("https://carvision.onrender.com/api/soldout-cars");



    if (!response.ok) {
      throw new Error("Failed to fetch cars.");
    }
    const soldOutCars = await response.json();
    console.log("Fetched Sold-Out Cars:", soldOutCars); // Debugging log
    setSoldOutCars(soldOutCars.reverse());
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching sold-out cars:", error);
    setIsLoading(false);
  }
};


    fetchSoldOutCars();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading Sold-Out Cars...</div>;
  }

  if (soldOutCars.length === 0) {
    return <div className="no-soldout">No sold-out cars available.</div>;
  }

  return (
    <div className="soldout-section">
      <h2 className="soldout-title">Sold-Out Cars</h2>
      <div className="soldout-cars-container">
        {soldOutCars.map((car) => (
          <div
            key={car.id}
            className="soldout-car-card"
            onClick={() => navigate(`/cardetails/${car.id}`)}
          >
            <div className="soldout-car-image-wrapper">
              <LazyLoadImage
                src={
                  car.pictures && car.pictures.length > 0
                    ? car.pictures[0]
                    : "https://via.placeholder.com/150"
                }
                alt={`${car.make} ${car.year}`}
                className="soldout-car-image"
                effect="blur"
              />
              <div className="soldout-watermark">SOLD</div>
            </div>
            <div className="soldout-car-info">
              <span className="soldout-car-make">{car.make} ({car.year})</span>
              <span className="soldout-car-price">${car.sellingPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SoldOut;