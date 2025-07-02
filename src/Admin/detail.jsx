import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiArrowGoBackFill } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Header from "../components/ui/Header";
import "./detail.css";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`https://carvision.onrender.com/api/cars/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch car details: ${response.statusText}`);
        }
        const data = await response.json();
        setCar(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setCar({ error: "Failed to load car details. Please try again later." });
      }
    };

    fetchCarData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));
  };

  const handleImageRemove = (index) => {
    const updatedPictures = car.pictures.filter((_, i) => i !== index);
    setCar((prevCar) => ({
      ...prevCar,
      pictures: updatedPictures,
    }));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    const reorderedPictures = [...car.pictures];
    const [draggedItem] = reorderedPictures.splice(draggedIndex, 1);
    reorderedPictures.splice(index, 0, draggedItem);
    setCar((prevCar) => ({
      ...prevCar,
      pictures: reorderedPictures,
    }));
    setDraggedIndex(null);
  };

  // Handle adding new images (accepts URLs)
  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // If you want to upload to a server, do it here and get the URL.
    // For now, we'll use local object URLs for preview (not persistent after reload).
    // Replace this logic with your upload logic as needed.
    const newImageUrls = await Promise.all(
      files.map(async (file) => {
        // Example: upload to server and get URL, or use local preview
        // Here, just using local preview:
        return URL.createObjectURL(file);
      })
    );

    setCar((prevCar) => ({
      ...prevCar,
      pictures: [...prevCar.pictures, ...newImageUrls],
    }));
  };

  const handleAddImageByUrl = () => {
    const url = prompt("Paste the image URL:");
    if (url && url.trim()) {
      setCar((prevCar) => ({
        ...prevCar,
        pictures: [...prevCar.pictures, url.trim()],
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://carvision.onrender.com/api/cars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          make: car.make,
          model: car.model,
          year: car.year,
          sellingPrice: car.sellingPrice,
          mileage: car.mileage,
          fuelType: car.fuelType,
          comment: car.comment,
          pictures: car.pictures,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save car details");
      }
      alert("Car details updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error saving car details:", error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (car.error) {
    return <div className="error">{car.error}</div>;
  }

  return (
    <div className="detail-page">
      <Header />

      <div className="detail-container">
        <div className="top-bar">
          <button className="go-back-button" onClick={() => navigate("/admin")}>
            <RiArrowGoBackFill /> Go Back
          </button>
        </div>

        <h1 className="detail-title">
          <input
            type="text"
            name="make"
            value={car.make || ""}
            onChange={handleInputChange}
            placeholder="Make"
          />
          <input
            type="number"
            name="year"
            value={car.year || ""}
            onChange={handleInputChange}
            placeholder="Year"
          />
        </h1>

        {/* Pictures Section */}
        <div className="main-media-container">
          <h3>Pictures</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button type="button" onClick={handleAddImage}>
              Add Image (File)
            </button>
            <button type="button" onClick={handleAddImageByUrl}>
              Add Image (URL)
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="uploaded-images-grid">
            {car.pictures.map((picture, index) => (
              <div
                key={index}
                className="uploaded-image-item"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <div
                  className="remove-icon"
                  onClick={() => handleImageRemove(index)}
                >
                  <IoIosArrowBack />
                </div>
                <LazyLoadImage
                  src={picture}
                  alt={`Picture ${index}`}
                  className="uploaded-image"
                  effect="blur"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Car Details Section */}
        <div className="details-section">
          <h3>Car Details</h3>
          <div className="detail-item">
            <input
              type="text"
              name="sellingPrice"
              value={car.sellingPrice || ""}
              onChange={handleInputChange}
              placeholder="Price"
            />
          </div>
          <div className="detail-item">
            <input
              type="number"
              name="mileage"
              value={car.mileage || ""}
              onChange={handleInputChange}
              placeholder="Mileage"
            />
          </div>
          <div className="detail-item">
            <input
              type="text"
              name="fuelType"
              value={car.fuelType || ""}
              onChange={handleInputChange}
              placeholder="Fuel Type"
            />
          </div>
          <div className="detail-item">
            <textarea
              name="comment"
              value={car.comment || ""}
              onChange={handleInputChange}
              placeholder="Comment"
            />
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Detail;
