import React, { useEffect, useState }  from 'react'

const Spotlight = ({ children }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const handleMouseMove = (event) => {
        setPosition({ x: event.clientX, y: event.clientY });
      };
  
      window.addEventListener("mousemove", handleMouseMove);
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);
  
    const spotlightStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.8))`,
      mixBlendMode: "multiply",
      zIndex: 1,
      transition: "background 0.1s ease",
    };
  
    const containerStyle = {
      position: "relative",
      overflow: "hidden",
    };
  
    const contentStyle = {
      position: "relative",
      zIndex: 2,
      padding: "20px",
      textAlign: "center",
      color: "#fff",
    };
  return (
    <div style={containerStyle}>
      <div style={spotlightStyle}></div>
      <div style={contentStyle}>{children}</div>
    </div>
  )
}

export default Spotlight;
