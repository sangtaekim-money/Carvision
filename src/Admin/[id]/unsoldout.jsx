 import React from "react";
import "./soldout.css";

function UnsoldOut({ carId, cars, setCars }) {
  const toggleUnsoldOut = async (id) => {
    // Find the current status of the car
    const currentStatus = cars.find((car) => car.id === id)?.soldOut;
    const newStatus = !currentStatus;

    try {
      // Send a PUT request to update the soldOut status using the /cars/:id endpoint
      const response = await fetch(`https://carvision.onrender.com/api/cars/${id}/soldout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soldOut: newStatus }), // Sending what the endpoint expects
      });

      if (!response.ok) {
        throw new Error(`Failed to update soldOut status. Server responded with ${response.status}`);
      }

      console.log(`Car ID ${id} marked as ${newStatus ? "sold out" : "available"}`);

      // Update the local state to reflect the new soldOut status
      const updatedCars = cars.map((car) =>
        car.id === id ? { ...car, soldOut: newStatus } : car
      );

      // Move available cars to the beginning of the list
      const soldOutCars = updatedCars.filter((car) => car.soldOut);
      const availableCars = updatedCars.filter((car) => !car.soldOut);
      setCars([...availableCars, ...soldOutCars]);
    } catch (error) {
      console.error("Failed to update soldOut status:", error);
    }
  };

  return (
    <div className="unsoldout-container">
      <button
        className="unsoldout-button"
        onClick={() => toggleUnsoldOut(carId)}
      >
        Unsold
      </button>
    </div>
  );
}

export default UnsoldOut;