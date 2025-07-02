import React, { useState } from "react";
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import { GrLanguage } from "react-icons/gr"; // Language icon
import { useLocation } from "react-router-dom"; // Import useLocation for route checking

import "./LanguageSwitcher.css"; // Import CSS for styling

function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown
  const location = useLocation(); // Get the current route

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Render the LanguageSwitcher only on the homepage
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div className="language-switcher">
      {/* Language Icon with Dropdown Toggle */}
      <div className="language-toggle" onClick={toggleDropdown}>
        <GrLanguage className="language-icon" />
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="language-dropdown">
          <button
            onClick={() => handleLanguageChange("en")}
            className={language === "en" ? "active" : ""}
            title="English"
          >
            <span role="img" aria-label="English Flag">
              🇬🇧
            </span>{" "}
            English
          </button>
          <button
            onClick={() => handleLanguageChange("ko")}
            className={language === "ko" ? "active" : ""}
            title="Korean"
          >
            <span role="img" aria-label="Korean Flag">
              🇰🇷
            </span>{" "}
            한국어
          </button>
          <button
            onClick={() => handleLanguageChange("ar")}
            className={language === "ar" ? "active" : ""}
            title="Arabic"
          >
            <span role="img" aria-label="Saudi Flag">
              🇸🇦
            </span>{" "}
            العربية
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;