import React from "react";
import "./Howtobuy.css"; // Make sure to create this CSS file for styling
import { FaSearch } from "react-icons/fa"; // Icon for browsing
import { MdFavorite } from "react-icons/md"; // Icon for choosing
import { FaPhoneAlt } from "react-icons/fa"; // Icon for contacting
import { useTranslation } from "../../TranslationContext"; // Import useTranslation

function Howtobuy() {
  const { translate } = useTranslation(); // Access the translate function

  const steps = [
    {
      icon: <FaSearch />,
      title: translate("browseAndSearch"),
      description: translate("browseAndSearchDescription"),
    },
    {
      icon: <MdFavorite />,
      title: translate("chooseAndDecide"),
      description: translate("chooseAndDecideDescription"),
    },
    {
      icon: <FaPhoneAlt />,
      title: translate("contactAndDeal"),
      description: translate("contactAndDealDescription"),
    },
  ];

  return (
    <div className="how-to-buy">
      <h2 className="how-to-buy-title">{translate("howToBuy")}</h2> {/* Translated title */}
      <div className="how-to-buy-cards-container">
        {steps.map((step, index) => (
          <div key={index} className="how-to-buy-card">
            <div className="card-icon">{step.icon}</div>
            <h3 className="card-title">{step.title}</h3>
            <p className="card-description">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="dots-container">
        {steps.map((_, index) => (
          <span key={index} className="dot"></span>
        ))}
      </div>
    </div>
  );
}

export default Howtobuy;