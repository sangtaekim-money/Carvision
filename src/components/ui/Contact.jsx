import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { RiArrowGoBackFill } from "react-icons/ri"; // Import back button icon
import { IoLogoWhatsapp } from "react-icons/io"; // WhatsApp icon
import { RiKakaoTalkFill } from "react-icons/ri"; // KakaoTalk icon
import { SiGmail } from "react-icons/si"; // Gmail icon
import { BsFillTelephoneFill } from "react-icons/bs"; // Telephone icon
import Header from "./Header"; // Import Header
import Stickybottommenu from "./Stickybottommenu"; // Import Stickybottommenu
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import "./Contact.css"; // Ensure this CSS file exists for styling
import profileImage from "../../Images/Mr Seo.jpg"; // Import the profile image

function Contact() {
  const navigate = useNavigate(); // Initialize navigation
  const { translate } = useTranslation(); // Access the translate function

  return (
    <>
      <Header /> {/* Include Header */}
      <div className="contact-page">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate("/")}>
          <RiArrowGoBackFill /> {translate("goBack")} {/* Translated text */}
        </button>

        <div className="contact-header">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <h1>{translate("contactUs")}</h1> {/* Translated title */}
          <p>{translate("contactIntro")}</p> {/* Translated introduction */}
        </div>

        <div className="contact-details">
          <h2>{translate("getInTouch")}</h2> {/* Translated heading */}
          <ul>
            <li>
              <a
                href="https://wa.me/821075611177"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon-link"
              >
                <IoLogoWhatsapp className="contact-icon whatsapp-icon" />
              </a>
              <strong>{translate("whatsapp")}:</strong>{" "}
              <a
                href="https://wa.me/821075611177"
                target="_blank"
                rel="noopener noreferrer"
              >
                +82 10 7561 1177
              </a>
            </li>
            <li>
              <a
                href="mailto:zerojhin@gmail.com"
                className="contact-icon-link"
              >
                <SiGmail className="contact-icon gmail-icon" />
              </a>
              <strong>{translate("email")}:</strong>{" "}
              <a href="mailto:zerojhin@gmail.com">
                zerojhin@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://open.kakao.com/o/Felix12great"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon-link"
              >
                <RiKakaoTalkFill className="contact-icon kakao-icon" />
              </a>
              <strong>{translate("kakaoTalk")}:</strong> Felix12great
            </li>
            <li>
              <a href="tel:+821075611177" className="contact-icon-link">
                <BsFillTelephoneFill className="contact-icon telephone-icon" />
              </a>
              <strong>{translate("telephone")}:</strong>{" "}
              <a href="tel:+821075611177">+82 10 7561 1177</a>
            </li>
          </ul>
        </div>

        <div className="contact-footer">
          <h2>{translate("aboutUs")}</h2> {/* Translated heading */}
          <p>{translate("aboutUsDescription")}</p> {/* Translated description */}
        </div>
      </div>
      <Stickybottommenu /> {/* Replace Footer with Stickybottommenu */}
    </>
  );
}

export default Contact;