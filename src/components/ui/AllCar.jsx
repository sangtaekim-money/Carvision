import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold4Fill } from 'react-icons/ri'; // Import the icon
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Import LazyLoadImage
import 'react-lazy-load-image-component/src/effects/blur.css'; // Import blur effect for lazy loading
import './AllCar.css'; // Update the CSS file name

function AllCar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu
  const [cars, setCars] = useState([]); // State to store fetched cars

  // Fetch all cars from the database
  const fetchCars = async () => {
    try {
      const response = await fetch('https://carvision.onrender.com/api/cars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();

      // Sort by most recent first
      const sortedCars = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCars(sortedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchCars(); // Fetch cars when the component mounts
  }, []);

  const handleCardClick = (id) => {
    navigate(`/cardetails/${id}`); // Navigate to the car's details page
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <RiMenuUnfold4Fill />
      </button>

      {/* Hidden Left-Side Menu */}
      <div className={`hidden-menu ${isMenuOpen ? 'visible' : ''}`}>
        <div className="menu-content">
          {cars.map((car) => (
            <div
              key={car.id}
              className="menu-item"
              onClick={() => handleCardClick(car.id)}
            >
              <LazyLoadImage
                src={
                  Array.isArray(car.pictures) && car.pictures.length > 0
                    ? car.pictures[0] // Use the first image if available
                    : 'https://via.placeholder.com/150' // Fallback placeholder
                }
                alt={`${car.make} ${car.year}`}
                className="menu-logo"
                effect="blur" // Blur effect while loading
                placeholderSrc="https://via.placeholder.com/150" // Placeholder image
              />
              <span className="menu-name">{car.make}</span>
              <span className="menu-year">{car.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllCar;