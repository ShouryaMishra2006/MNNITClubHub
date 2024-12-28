import { createContext, useContext } from "react";
const ClubUserContext=createContext();
export const ClubUserContextProvider=({children})=>{
    const [users,setusers]=useState([]);
    return(
        <ClubUserContext.Provider value={{users,setusers}}>
          {children}
        </ClubUserContext.Provider>
    )
};
export const useClubUsers=useContext(ClubUserContext);