import React, { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three"; // Import three.js
const Interactive = () => {
    const vantaRef = useRef(null); // Create a reference for the div
    const vantaEffect = useRef(null); // Track the Vanta effect instance
  
    useEffect(() => {
      // Initialize Vanta with THREE explicitly passed
      vantaEffect.current = NET({
        el: vantaRef.current, // Reference to the container element
        THREE, // Explicitly pass the THREE library
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x000000,
        color: 0xff0000,
      });
  
      // Cleanup on component unmount
      return () => {
        if (vantaEffect.current) vantaEffect.current.destroy();
      };
    }, []);
  
    return (
      <div
        ref={vantaRef} // Attach the reference to the div
        style={{ width: "100vw", height: "100vh" }}
      >
      </div>
    );
  };
  
  export default Interactive;
  