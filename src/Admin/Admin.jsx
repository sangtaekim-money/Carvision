import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { MdOutlineMenuOpen } from "react-icons/md";
import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";
import SoldOut from "./[id]/soldout.jsx"; // Import the SoldOut component
import UnsoldOut from "./[id]/unsoldout.jsx"; // Import the UnsoldOut component
import DeleteCar from "./[id]/delete.jsx"; // Import the DeleteCar component
import "./Admin.css";

function Admin() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 20;
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const response = await fetch("https://carvision.onrender.com/api/all-cars");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await response.json();

      setCars(data.reverse());
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleEdit = (id) => {
    navigate(`/detail/${id}`);
  };

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

  return (
    <div className="admin">
      <Header />
      <button className="back-button" onClick={() => navigate("/")}>
        <IoReturnUpBack /> Back
      </button>
      <h1 className="admin-title">Admin Panel</h1>

      <div className="cars-grid">
        {currentCars.map((car) => (
          <div key={car.id} className={`car-item ${car.soldOut ? "sold-out" : ""}`}>
            <div className="menu-icon">
              <MdOutlineMenuOpen
                size={24}
                onClick={() => {
                  const dropdown = document.getElementById(`dropdown-${car.id}`);
                  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
                }}
              />
              <div id={`dropdown-${car.id}`} className="dropdown-menu">
                <button onClick={() => handleEdit(car.id)}>Edit</button>
                <SoldOut carId={car.id} cars={cars} setCars={setCars} />
                <UnsoldOut carId={car.id} cars={cars} setCars={setCars} />
                <DeleteCar carId={car.id} cars={cars} setCars={setCars} />
              </div>
            </div>
            <img
              src={
                Array.isArray(car.pictures) && car.pictures.length > 0
                  ? car.pictures[0]
                  : "https://via.placeholder.com/150"
              }
              alt={`${car.make} ${car.year}`}
              className="car-image"
            />
            {car.soldOut && <div className="soldout-watermark">SOLD OUT</div>}
            <div className="car-footer">
              <span className="car-make">{car.make}</span>
              <span className="car-year">{car.year}</span>
            </div>
          </div>
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
      <Footer />
    </div>
  );
}

export default Admin;