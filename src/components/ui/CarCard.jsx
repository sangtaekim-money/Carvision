import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegShareFromSquare } from "react-icons/fa6";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./CarCard.css";

function CarCard({ car, onCardClick, latestComment, onCommentUpdate }) {
  // Edit states for each field
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isEditingMakeYear, setIsEditingMakeYear] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  // Field values
  const [commentValue, setCommentValue] = useState(latestComment || "");
  const [makeValue, setMakeValue] = useState(car.make || "");
  const [yearValue, setYearValue] = useState(car.year || "");
  const [priceValue, setPriceValue] = useState(car.sellingPrice || "");

  useEffect(() => {
    setCommentValue(latestComment || "");
  }, [latestComment]);
  useEffect(() => {
    setMakeValue(car.make || "");
    setYearValue(car.year || "");
    setPriceValue(car.sellingPrice || "");
  }, [car.make, car.year, car.sellingPrice]);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `https://carvision.onrender.com/car/${car.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${car.make} ${car.model} (${car.year})`,
          text: `Check out this car: ${car.make} ${car.model} (${car.year}) for $${car.sellingPrice}.`,
          url: shareUrl,
        })
        .then(() => console.log("Car shared successfully!"))
        .catch((error) => console.error("Error sharing car:", error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Only the image is clickable for details
  const handleImageClick = (e) => {
    e.stopPropagation();
    if (onCardClick) onCardClick(car.id);
  };

  // --- Comment ---
  const handleCommentClick = (e) => {
    e.stopPropagation();
    setIsEditingComment(true);
  };
  const handleCommentChange = (e) => setCommentValue(e.target.value);
  const handleCommentBlurOrEnter = async (e) => {
    if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
      setIsEditingComment(false);
      if (commentValue !== latestComment && onCommentUpdate) {
        await onCommentUpdate(car.id, commentValue, makeValue, yearValue, priceValue);
      }
    }
  };

  // --- Make/Year ---
  const handleMakeYearClick = (e) => {
    e.stopPropagation();
    setIsEditingMakeYear(true);
  };
  const handleMakeChange = (e) => setMakeValue(e.target.value);
  const handleYearChange = (e) => setYearValue(e.target.value);
  const handleMakeYearBlurOrEnter = async (e) => {
    if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
      setIsEditingMakeYear(false);
      if ((makeValue !== car.make || yearValue !== car.year) && onCommentUpdate) {
        await onCommentUpdate(car.id, commentValue, makeValue, yearValue, priceValue);
      }
    }
  };

  // --- Price ---
  const handlePriceClick = (e) => {
    e.stopPropagation();
    setIsEditingPrice(true);
  };
  const handlePriceChange = (e) => setPriceValue(e.target.value);
  const handlePriceBlurOrEnter = async (e) => {
    if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
      setIsEditingPrice(false);
      if (priceValue !== car.sellingPrice && onCommentUpdate) {
        await onCommentUpdate(car.id, commentValue, makeValue, yearValue, priceValue);
      }
    }
  };

  // Truncate comment if too long
  const truncate = (str, n) => (str && str.length > n ? str.slice(0, n) + "..." : str);

  return (
    <div
      className={`car-card ${car.soldOut ? "sold-out" : ""}`}
      style={{ flexDirection: "row-reverse" }}
    >
      {/* Share Icon */}
      <div className="share-icon" onClick={handleShare}>
        <FaRegShareFromSquare />
      </div>

      {/* SOLD OUT Watermark */}
      {car.soldOut && <div className="soldout-watermark">SOLD OUT</div>}

      {/* Car Image - only this is clickable */}
      <div className="car-image-wrapper" onClick={handleImageClick} style={{ cursor: "pointer" }}>
        <LazyLoadImage
          src={
            car.pictures && car.pictures.length > 0
              ? car.pictures[0]
              : "https://via.placeholder.com/150"
          }
          alt={`${car.make} ${car.year}`}
          className="car-image"
          effect="blur"
        />
      </div>

      {/* Car Details */}
      <div className="car-info">
        {/* Make & Year */}
        <div className="car-make-year-light" onClick={handleMakeYearClick}>
          {isEditingMakeYear ? (
            <>
              <input
                type="text"
                value={makeValue}
                onChange={handleMakeChange}
                onBlur={handleMakeYearBlurOrEnter}
                onKeyDown={handleMakeYearBlurOrEnter}
                style={{ width: "45%", marginRight: 4 }}
                autoFocus
              />
              <input
                type="number"
                value={yearValue}
                onChange={handleYearChange}
                onBlur={handleMakeYearBlurOrEnter}
                onKeyDown={handleMakeYearBlurOrEnter}
                style={{ width: "45%" }}
              />
            </>
          ) : (
            <>
              {car.make} {car.year}
            </>
          )}
        </div>
        {/* Price */}
        <div className="car-price-light" onClick={handlePriceClick}>
          {isEditingPrice ? (
            <input
              type="text"
              value={priceValue}
              onChange={handlePriceChange}
              onBlur={handlePriceBlurOrEnter}
              onKeyDown={handlePriceBlurOrEnter}
              style={{ width: "90%" }}
              autoFocus
            />
          ) : (
            car.sellingPrice
          )}
        </div>
        {/* Comment */}
        <div className="car-comment-label">Comment</div>
        <div className="car-comment-light" onClick={handleCommentClick}>
          {isEditingComment ? (
            <input
              type="text"
              value={commentValue}
              autoFocus
              maxLength={255}
              onChange={handleCommentChange}
              onBlur={handleCommentBlurOrEnter}
              onKeyDown={handleCommentBlurOrEnter}
              style={{ width: "90%" }}
            />
          ) : (
            latestComment
              ? truncate(latestComment, 60)
              : <span className="car-no-comment">No comments yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarCard;
