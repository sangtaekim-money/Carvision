import React from "react";
import "./Category.css";
import { IoCarSport } from "react-icons/io5";
import { TbCarSuvFilled } from "react-icons/tb";
import { FaBus } from "react-icons/fa";
import { FaTruckFront } from "react-icons/fa6";
import { BiSolidCarGarage } from "react-icons/bi";
import { useTranslation } from "../../TranslationContext";
import { useNavigate } from "react-router-dom"; // 👈 Import this

function Category() {
  const { translate } = useTranslation();
  const navigate = useNavigate(); // 👈 Init router

  const categories = [
    { name: "sedan", icon: <IoCarSport /> },
    { name: "suv", icon: <TbCarSuvFilled /> },
    { name: "bus", icon: <FaBus /> },
    { name: "truck", icon: <FaTruckFront /> },
    { name: "convertible", icon: <BiSolidCarGarage /> },
    { name: "electric", icon: "⚡" },
  ];

  const handleClick = (categoryName) => {
    navigate(`/cars/category/${categoryName}`);
  };

  return (
    <div className="category-section">
      <h2>{translate("exploreCategories")}</h2>
      <div className="category-container">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-item"
            onClick={() => handleClick(category.name)}
            style={{ cursor: "pointer" }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{translate(category.name)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
