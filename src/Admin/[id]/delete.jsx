import React, { useState } from "react";
import "./delete.css";

function DeleteCar({ carId, cars, setCars }) {
  const [showPopup, setShowPopup] = useState(false);

  const deleteCar = async (id) => {
    try {
      const response = await fetch(`https://carvision.onrender.com/api/cars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete car. Server responded with ${response.status}`);
      }

      console.log(`Car ID ${id} deleted successfully`);

      // Update the local state to remove the deleted car
      const updatedCars = cars.filter((car) => car.id !== id);
      setCars(updatedCars);
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  const handleDelete = () => {
    deleteCar(carId);
    setShowPopup(false); // Close the popup after deletion
  };

  return (
    <div className="delete-container">
      <button className="delete-button" onClick={() => setShowPopup(true)}>
        Delete
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Are you sure?</h3>
            <p>This action is irreversible. Do you want to delete this car?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteCar;