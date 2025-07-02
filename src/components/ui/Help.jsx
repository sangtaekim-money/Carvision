import React, { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri"; // Import back button icon
import { FaArrowDownShortWide } from "react-icons/fa6"; // Import toggle icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Header from "./Header"; // Import Header
import Stickybottommenu from "./Stickybottommenu"; // Import Stickybottommenu
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import "./Help.css"; // Ensure this CSS file exists for styling

function Help() {
  const navigate = useNavigate(); // Initialize navigation
  const { translate } = useTranslation(); // Access the translate function

  // State to manage toggles for FAQ answers
  const [faqVisibility, setFaqVisibility] = useState({
    search: false,
    buying: false,
    support: false,
  });

  const toggleFaq = (key) => {
    setFaqVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <Header /> {/* Include Header */}
      <div className="help-page">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate("/")}>
          <RiArrowGoBackFill /> {translate("goBack")} {/* Translated text */}
        </button>

        <h1>{translate("helpCenter")}</h1> {/* Translated title */}
        <p>{translate("helpIntro")}</p> {/* Translated introduction */}

        <div className="help-sections">
          {/* FAQ Section */}
          <div className="help-section">
            <h2>{translate("faq")}</h2> {/* Translated heading */}
            <ul>
              <li>
                <button
                  className="faq-toggle"
                  onClick={() => toggleFaq("search")}
                >
                  <FaArrowDownShortWide /> {translate("faqSearch")}
                </button>
                {faqVisibility.search && (
                  <p className="faq-answer">{translate("faqSearchAnswer")}</p>
                )}
              </li>
              <li>
                <button
                  className="faq-toggle"
                  onClick={() => toggleFaq("buying")}
                >
                  <FaArrowDownShortWide /> {translate("faqBuying")}
                </button>
                {faqVisibility.buying && (
                  <p className="faq-answer">
                    {translate("faqBuyingAnswer")}{" "}
                    <a
                      href="https://example.com/buying-process"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translate("buyingGuideLink")}
                    </a>
                  </p>
                )}
              </li>
              <li>
                <button
                  className="faq-toggle"
                  onClick={() => toggleFaq("support")}
                >
                  <FaArrowDownShortWide /> {translate("faqSupport")}
                </button>
                {faqVisibility.support && (
                  <p className="faq-answer">
                    {translate("faqSupportAnswer")}{" "}
                    <a
                      href="/contact"
                      onClick={() => navigate("/contact")}
                    >
                      {translate("contactPageLink")}
                    </a>
                  </p>
                )}
              </li>
            </ul>
          </div>

          {/* Contact Support Section */}
          <div className="help-section">
            <h2>{translate("contactSupport")}</h2> {/* Translated heading */}
            <p>{translate("contactSupportIntro")}</p> {/* Translated intro */}
            <ul>
              <li>
                {translate("email")}:{" "}
                <a href="mailto:zerojhin@gmail.com">
                  zerojhin@gmail.com
                </a>
              </li>
              <li>
                {translate("phone")}:{" "}
                <a href="tel:+821075611177">+82 10 7561 1177</a>
              </li>
            </ul>
          </div>

          {/* Guides Section */}
          <div className="help-section">
            <h2>{translate("guides")}</h2> {/* Translated heading */}
            <p>{translate("guidesIntro")}</p> {/* Translated intro */}
            <ul>
              <li>{translate("guideSearch")}</li>
              <li>{translate("guidePlatform")}</li>
              <li>{translate("guideContact")}</li>
            </ul>
          </div>
        </div>
      </div>
      <Stickybottommenu /> {/* Include Stickybottommenu */}
    </>
  );
}

export default Help;