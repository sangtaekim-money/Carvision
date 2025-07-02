import React from "react";
import "./Stickybottommenu.css"; // Make sure to create this CSS file for styling
import { GoHomeFill } from "react-icons/go"; // Home icon
import { FaSearch, FaPhoneAlt } from "react-icons/fa"; // Search and Contact icons
import { IoLogoWhatsapp } from "react-icons/io5"; // WhatsApp icon
import { Link } from "react-router-dom"; // Import Link from React Router
import { useTranslation } from "../../TranslationContext"; // Import useTranslation

function Stickybottommenu() {
  const { translate } = useTranslation(); // Access the translate function

  return (
    <div className="sticky-menu">
      <Link to="/" className="menu-item"> {/* Link to HomePage */}
        <GoHomeFill />
        <span>{translate("home")}</span> {/* Translated text */}
      </Link>
      <Link to="/search" className="menu-item"> {/* Link to Search */}
        <FaSearch />
        <span>{translate("search")}</span> {/* Translated text */}
      </Link>
      <a
        href="https://wa.me/821021597173" // WhatsApp link with the number
        className="menu-item"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IoLogoWhatsapp />
        <span>{translate("whatsapp")}</span> {/* Translated text */}
      </a>
      <Link to="/contact" className="menu-item"> {/* Link to Contact */}
        <FaPhoneAlt />
        <span>{translate("contact")}</span> {/* Translated text */}
      </Link>
    </div>
  );
}

export default Stickybottommenu;