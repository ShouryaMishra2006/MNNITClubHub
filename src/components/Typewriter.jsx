import React, { useState, useEffect } from "react";
const Typewriter = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let index = 0;
    setDisplayedText(""); 

    const typeWriter = () => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
        setTimeout(typeWriter, speed);
      }
    };

    typeWriter();

    return () => {
      setDisplayedText(""); // Clean up on unmount
    };
  }, [text,speed]);

  return <span>{displayedText}</span>;
  };
 export default Typewriter; 