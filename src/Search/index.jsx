import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import "./search.css"; // Import CSS for styling
import { RiArrowGoBackFill } from "react-icons/ri"; // Back arrow icon
import Header from "../components/ui/Header"; // Import the Header component
import Footer from "../components/ui/Footer"; // Import the Footer component

function MakeSearch() {
  const { make } = useParams(); // Get the make from the URL
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [cars, setCars] = useState([]); // State to store fetched cars
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchCarsByMake = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://carvision.onrender.com/api/cars?make=${make}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
        setCars(data.filter((car) => car.make && car.make.toLowerCase() === make.toLowerCase()));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (make) {
      fetchCarsByMake(); // Fetch cars when the make changes
    }
  }, [make]);

  const handleCarClick = (carId) => {
    navigate(`/cardetails/${carId}`); // Redirect to the car details page
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <>
      <Header /> {/* Include the Header component */}
      <div className="search-section">
        <div className="search-header">
          <button className="back-button" onClick={handleGoBack}>
            <RiArrowGoBackFill className="back-icon" /> {/* Back arrow icon */}
          </button>
          <h2>Search Results for: {make}</h2>
        </div>
        <div className="search-results">
          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && cars.length > 0 && (
            <div className="cars-list">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="car-item"
                  onClick={() => handleCarClick(car.id)} // Redirect to car details on click
                  style={{ cursor: "pointer" }} // Add pointer cursor for better UX
                >
                  <img
                    src={
                      Array.isArray(car.pictures) && car.pictures.length > 0
                        ? car.pictures[0]
                        : "https://via.placeholder.com/150"
                    }
                    alt={`${car.make} ${car.model}`}
                    className="car-image"
                  />
                  <div className="car-info">
                    <span className="car-make">{car.make}</span>
                    <span className="car-model">{car.model}</span>
                    <span className="car-price">${car.sellingPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !error && cars.length === 0 && <p>No cars available for {make}</p>}
        </div>
      </div>
      <Footer /> {/* Include the Footer component */}
    </>
  );
}

export default MakeSearch;