import React, { useEffect, useState } from "react";
import "./Intro.css";

function Intro({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish(); // Notify parent when intro is finished
    }, 3000); // Show intro for 3 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  return (
    <div className="intro">
      <h1>Welcome to Carvision</h1>
      <p>Your Dream Car Awaits</p>
    </div>
  );
}

export default Intro;