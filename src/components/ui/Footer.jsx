import React from "react";
import "./Footer.css"; // Make sure to create this CSS file for styling
import { IoLogoGooglePlaystore } from "react-icons/io5"; // Playstore icon
import { IoLogoWhatsapp } from "react-icons/io"; // WhatsApp icon
import { SiKakaotalk } from "react-icons/si"; // KakaoTalk icon
import { useTranslation } from "../../TranslationContext"; // Import useTranslation

function Footer() {
  const { translate } = useTranslation(); // Access the translate function

  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-section">
          <h3>{translate("search")}</h3> {/* Translated heading */}
          <p>{translate("footerSearchDescription")}</p> {/* Translated description */}
        </div>
        <div className="footer-section">
          <h3>{translate("contact")}</h3> {/* Translated heading */}
          <p>{translate("footerContactDescription")}</p> {/* Translated description */}
        </div>
        <div className="footer-section">
          <h3>{translate("aboutUs")}</h3> {/* Translated heading */}
          <p>{translate("footerAboutDescription")}</p> {/* Translated description */}
        </div>
        <div className="footer-section">
          <h3>{translate("policy")}</h3> {/* Translated heading */}
          <p>{translate("footerPolicyDescription")}</p> {/* Translated description */}
        </div>
      </div>

      <div className="footer-icons">
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <IoLogoGooglePlaystore />
        </a>
        <a
          href="https://wa.me/821021597173"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <IoLogoWhatsapp />
        </a>
        <a
          href="https://open.kakao.com/o/Felix12great"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <SiKakaotalk />
        </a>
      </div>

      <div className="footer-bottom">
        <p>© 2025 KoreaCar. {translate("allRightsReserved")}</p> {/* Translated copyright */}
      </div>
    </footer>
  );
}

export default Footer;