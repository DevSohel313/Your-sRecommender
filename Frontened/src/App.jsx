import { useState } from "react";
import TestSpinner from "../TestSpinner";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import NavLinks from "./shared/components/Navigation/NavLinks";
import SideDrawer from "./shared/components/Navigation/SideDrawer";
import UsersPlaces from "./places/pages/UsersPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Authenticate from "./user/pages/Authenticate";
import authContext from "./shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const login = (userid) => {
    setIsLoggedIn(true);
    setUserId(userid);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <authContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        creatorId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Users />} />
            {isLoggedIn && (
              <>
                <Route path="/:uid/places" element={<UsersPlaces />} />
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
            <Route path="/:uid/places" element={<UsersPlaces />} />
            <Route path="/auth" element={<Authenticate />} />
          </Routes>
        </main>
      </Router>
    </authContext.Provider>
  );
}

export default App;
