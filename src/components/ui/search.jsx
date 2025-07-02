import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Import search icon
import { RiArrowGoBackFill } from "react-icons/ri"; // Import back button icon
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import Header from "./Header"; // Import Header
import Stickybottommenu from "./Stickybottommenu"; // Import Stickybottommenu
import "./search.css";

function Search({ showAvailableCars = false }) {
  const [query, setQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState([]); // State for filtered cars
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { translate } = useTranslation(); // Access the translate function

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`https://carvision.onrender.com/api/cars`);
        const data = await response.json();
        setFilteredCars(data); // Initially display all cars
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://carvision.onrender.com/api/cars?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setFilteredCars(data);
    } catch (error) {
      console.error("Error searching cars:", error);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/search/make/${tag.toLowerCase()}`); // Redirect to the MakeSearch page
  };

  const tags = [
    "Hyundai",
    "Kia",
    "Mercedes-Benz",
    "Volkswagen",
    "Audi",
    "BMW",
    "Lexus",
    "Chevrolet",
    "Toyota",
    "Tesla",
  ];

  return (
    <>
      {/* Conditionally render the Header */}
      {location.pathname === "/search" && <Header />}
      <div className="search-container">
        {/* Back Button - Only show on the Search page */}
        {location.pathname === "/search" && (
          <button className="back-button" onClick={() => navigate("/")}>
            <RiArrowGoBackFill /> {translate("goBack")} {/* Translated text */}
          </button>
        )}

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={translate("searchPlaceholder")} // Translated placeholder
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        {/* Tags Section */}
        <div className="tags-container">
          {tags.map((tag) => (
            <span key={tag} className="tag" onClick={() => handleTagClick(tag)}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Available Cars Section */}
        {showAvailableCars && (
          <div className="available-cars">
            <h2>{translate("availableCars")}</h2> {/* Translated heading */}
            <div className="car-list">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="car-item"
                    onClick={() => navigate(`/cardetails/${car.id}`)}
                  >
                    <img
                      src={
                        Array.isArray(car.pictures) && car.pictures.length > 0
                          ? car.pictures[0]
                          : "https://via.placeholder.com/150"
                      }
                      alt={`${car.make} ${car.year}`}
                      className="car-image"
                    />
                    <div className="car-info">
                      <span className="car-make">{car.make}</span>
                      <span className="car-year">{car.year}</span>
                      <span className="car-model">{car.model}</span>
                      <span className="car-price">${car.sellingPrice}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>{translate("noCarsAvailable")}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Stickybottommenu /> {/* Include Stickybottommenu */}
    </>
  );
}

export default Search;