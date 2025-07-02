import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard.jsx";
import "./Listings.css";

function Listings() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;
  const navigate = useNavigate();

  // Fetch car listings
  const fetchListings = async () => {
    try {
      const response = await fetch("https://carvision.onrender.com/api/available-cars");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await response.json();

      // Sort cars: non-sold-out cars first, then sold-out cars
      const sortedData = data.sort((a, b) => {
        if (a.soldOut === b.soldOut) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.soldOut - b.soldOut;
      });

      setCars(sortedData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const nextPage = () => {
    if (indexOfLastCar < cars.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleCardClick = (carId) => {
    navigate(`/cardetails/${carId}`);
  };

  // Handler to update the car fields (comment, make, year, price)
  const handleCarUpdate = async (carId, comment, make, year, price) => {
    try {
      const response = await fetch(`https://carvision.onrender.com/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment,
          make,
          year,
          sellingPrice: price,
        }),
      });
      if (!response.ok) throw new Error("Failed to update car");
      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === carId
            ? { ...car, comment, make, year, sellingPrice: price }
            : car
        )
      );
    } catch (error) {
      alert("Failed to update car.");
      console.error(error);
    }
  };

  return (
    <div className="listings">
      <h1 className="listings-title">Car Listings</h1>

      <div className="cars-grid">
        {currentCars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onCardClick={handleCardClick}
            latestComment={car.comment}
            onCommentUpdate={handleCarUpdate}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {Math.ceil(cars.length / carsPerPage)}
        </span>
        <button
          className="pagination-button"
          onClick={nextPage}
          disabled={indexOfLastCar >= cars.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Listings;
