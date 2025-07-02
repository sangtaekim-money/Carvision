import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.js';
import AllCar from './components/ui/AllCar.jsx';
import Cardetails from './components/ui/Cardetails.jsx';
import Search from './components/ui/search.jsx';
import Contact from './components/ui/Contact.jsx';
import Help from './components/ui/Help.jsx';
import LanguageSwitcher from './components/ui/LanguageSwitcher.jsx';
import AddListing from './AddListing/AddListing.jsx';
import Admin from './Admin/Admin.jsx';
import RecentCar from './components/ui/RecentCar.jsx';
import Intro from './components/ui/Intro.jsx'; // Import the Intro component
import MakeSearch from "./Search/index.jsx"; // Import the MakeSearch component
import CategorySearch from './Search/[Category)]/index.jsx';
import './App.css'; // Import the CSS for styling
import Detail from './Admin/detail.jsx';

function App() {
  const [introFinished, setIntroFinished] = useState(false); // State to track if the intro is finished
  const [deferredPrompt, setDeferredPrompt] = useState(null); // State for install prompt
  const [showToast, setShowToast] = useState(false); // State to show/hide the toast

  // Handle the "beforeinstallprompt" event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default mini-infobar from appearing
      event.preventDefault();
      setDeferredPrompt(event);
      setShowToast(true); // Show the toast notification
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Handle the "Install App" button click
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset the deferred prompt
        setShowToast(false); // Hide the toast
      });
    }
  };

  return (
    <BrowserRouter>
      {!introFinished ? (
        <Intro onFinish={() => setIntroFinished(true)} /> // Show the intro screen
      ) : (
        <>
          <LanguageSwitcher />
          {showToast && (
            <div className="toast-container">
              <div className="toast">
                <p>Install our app for a better experience!</p>
                <button className="toast-button" onClick={handleInstallClick}>
                  Install
                </button>
                <button
                  className="toast-close"
                  onClick={() => setShowToast(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/AllCar" element={<AllCar />} />
            <Route path="/cardetails/:id" element={<Cardetails />} />
            <Route path="/RecentCar" element={<RecentCar />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/make/:make" element={<MakeSearch />} /> {/* Dynamic make search */}
            <Route path="/search/:query" element={<Search />} />
            <Route path="/cars/category/:category" element={<CategorySearch />} /> {/* Updated route */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/AddListing" element={<AddListing />} />
            <Route path="/AddListing/:id" element={<AddListing />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/detail/:id" element={<Detail />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;