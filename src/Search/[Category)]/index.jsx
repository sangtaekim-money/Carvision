import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import "./category.css"; // Import CSS for styling
import { IoCarSport } from "react-icons/io5"; // Sedan icon
import { TbCarSuvFilled } from "react-icons/tb"; // SUV icon
import { FaBus } from "react-icons/fa"; // Bus icon
import { FaTruckFront } from "react-icons/fa6"; // Truck icon
import { BiSolidCarGarage } from "react-icons/bi"; // Convertible icon
import { RiArrowGoBackFill } from "react-icons/ri"; // Back arrow icon
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import Header from "../../components/ui/Header"; // Import the Header component
import Footer from "../../components/ui/Footer"; // Import the Footer component

function CategorySearch() {
  const { translate } = useTranslation(); // Access the translate function
  const { category } = useParams(); // Get the category from the URL
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [cars, setCars] = useState([]); // State to store fetched cars
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  // Map category names to icons
  const categoryIcons = {
    sedan: <IoCarSport />,
    suv: <TbCarSuvFilled />,
    bus: <FaBus />,
    truck: <FaTruckFront />,
    convertible: <BiSolidCarGarage />,
  };

  useEffect(() => {
    const fetchCarsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://carvision.onrender.com/api/cars?category=${category}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
       setCars(data.filter((car) => car.category && car.category.toLowerCase() === category.toLowerCase()));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCarsByCategory(); // Fetch cars when the category changes
    }
  }, [category]);

  const handleCarClick = (carId) => {
    navigate(`/cardetails/${carId}`); // Redirect to the car details page
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <>
      <Header /> {/* Include the Header component */}
      <div className="category-section">
        <div className="category-header">
          <button className="back-button" onClick={handleGoBack}>
            <RiArrowGoBackFill className="back-icon" /> {/* Back arrow icon */}
          </button>
          <h2>
            {categoryIcons[category] && <span className="category-icon">{categoryIcons[category]}</span>} {/* Display the icon */}
            {translate("exploreCategories")}: {category}
          </h2>
        </div>
        <div className="category-results">
          {loading && <p>{translate("loading")}</p>}
          {error && <p className="error">{translate("errorFetchingCars")}: {error}</p>}
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
          {!loading && !error && cars.length === 0 && <p>{translate("noCarsAvailable")}</p>}
        </div>
      </div>
      <Footer /> {/* Include the Footer component */}
    </>
  );
}

export default CategorySearch;