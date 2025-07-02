import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillAlt,
  FaCar,
  FaTachometerAlt,
  FaGasPump,
  FaCalendarAlt,
  FaIndustry,
} from "react-icons/fa";
import { LiaCommentSolid } from "react-icons/lia";
import carDetails from "../Data/CarDetails.json";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoReturnUpBack } from "react-icons/io5";
import "./AddListing.css";
import { db } from "../schema"; // Import Drizzle ORM instance
import { CarListing } from "../schema"; // Import the CarListing table schema

function AddListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pictures: [],
    make: "",
    year: "",
    mileage: "",
    sellingPrice: "",
    fuelType: "",
    category: "",
    comment: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    const reorderedImages = [...selectedImages];
    const [draggedItem] = reorderedImages.splice(draggedIndex, 1);
    reorderedImages.splice(index, 0, draggedItem);
    setSelectedImages(reorderedImages);
    setDraggedIndex(null);
  };

  const uploadImagesToSpaces = async () => {
  setIsUploading(true); // Start loading
  const uploadedUrls = [];

  for (const image of selectedImages) {
    const formData = new FormData();
    formData.append("file", image.file);

    try {
      const res = await fetch("https://carvision.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        uploadedUrls.push(data.url);
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  setFormData((prevData) => ({
    ...prevData,
    pictures: uploadedUrls,
  }));
  setIsUploading(false); // Stop loading
};

const handleNext = async () => {
  if (currentStep === 1) {
    await uploadImagesToSpaces();
    // Wait a bit to ensure state is updated (optional, React batching fix)
    await new Promise((res) => setTimeout(res, 300));
  }
  setCurrentStep((prevStep) => prevStep + 1);
};

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert data directly into the database using Drizzle ORM
      await db.insert(CarListing).values({
        make: formData.make || null,
        year: formData.year ? parseInt(formData.year, 10) : null,
        mileage: formData.mileage ? parseInt(formData.mileage, 10) : null,
        comment: formData.comment || null,
        sellingPrice: formData.sellingPrice || null,
        fuelType: formData.fuelType || null,
        category: formData.category || null,
        pictures: formData.pictures || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        soldOut: false,
      });

      setMessage("Listing submitted successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to submit the listing. Please try again.");
    }
  };

  return (
    <div className="add-listing-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <IoReturnUpBack /> Back
      </button>
      {message && <div className="message-box">{message}</div>}
      {isUploading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Uploading... Please wait</p>
        </div>
      )}
      <h1 className="form-title">Add Listing</h1>
      <form onSubmit={handleSubmit} className="add-listing-form">
        {/* Step 1: Add Pictures */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2 className="step-title">Step 1: Add Pictures</h2>
            <div className="upload-area">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
              />
              <p className="upload-text">Select images to upload</p>
            </div>
            <div className="uploaded-images-grid">
              {selectedImages.map((image, index) => (
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
                    <IoCloseCircleSharp />
                  </div>
                  <img
                    src={image.preview}
                    className="uploaded-image"
                    alt={`Selected ${index}`}
                  />
                </div>
              ))}
            </div>
            <div className="button-group">
              <button
                type="button"
                className="next-button"
                onClick={handleNext}
                disabled={isUploading} // Disable when uploading
              >
                {isUploading ? "Uploading..." : "Next"}
              </button>
              <button
                type="button"
                className="admin-button"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Comment */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2 className="step-title">Step 2: Add Comment</h2>
            <div className="form-field">
              <label>
                <LiaCommentSolid /> Comment
              </label>
              <textarea
                placeholder="Enter your comment"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                rows="5"
                className="comment-textarea"
              ></textarea>
            </div>
            <div className="button-group">
              <button
                type="button"
                className="previous-button"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                type="button"
                className="next-button"
                onClick={() => setCurrentStep((prevStep) => prevStep + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Car Details */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2 className="step-title">Step 3: Add Car Details</h2>
            <div className="form-grid">
              {carDetails.carDetails.map((item, index) => (
                <div key={index} className="form-field">
                  <label>
                    {item.icon === "FaIndustry" && <FaIndustry />}
                    {item.icon === "FaCalendarAlt" && <FaCalendarAlt />}
                    {item.icon === "FaGasPump" && <FaGasPump />}
                    {item.icon === "FaTachometerAlt" && <FaTachometerAlt />}
                    {item.icon === "FaCar" && <FaCar />}
                    {item.icon === "FaMoneyBillAlt" && <FaMoneyBillAlt />}
                    {item.icon === "LiaCommentSolid" && <LiaCommentSolid />}
                    {item.label}
                  </label>
                  {item.fieldType === "dropdown" ? (
                    <select
                      value={formData[item.name] || ""}
                      onChange={(e) =>
                        handleInputChange(item.name, e.target.value)
                      }
                    >
                      <option value="">Select {item.label}</option>
                      {item.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={item.fieldType}
                      placeholder={item.placeholder}
                      value={formData[item.name] || ""}
                      onChange={(e) =>
                        handleInputChange(item.name, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="button-group">
              <button
                type="button"
                className="previous-button"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AddListing;
