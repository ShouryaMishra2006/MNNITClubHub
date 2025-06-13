import React, { createContext, useState, useContext } from "react";

const ClubContext = createContext();

export const ClubProvider = ({ children }) => {
  const [clubId, setClubId] = useState(null);

  return (
    <ClubContext.Provider value={{ clubId, setClubId }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => useContext(ClubContext);
