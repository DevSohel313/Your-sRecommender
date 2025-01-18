import { useCallback, useState } from "react";
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
import { useEffect } from "react";
import Authenticate from "./user/pages/Authenticate";
import ForgotPassword from "./user/pages/forgotPassword";
import ResetPassword from "./user/pages/ResetPassword";
import authContext from "./shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(true);
  const login = useCallback((userid, token) => {
    setToken(token);
    setUserId(userid);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userid: userid,
        token: token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userid, storedData.token);
    } else {
      setToken(null);
      setUserId(null);
    }
  }, [login]);

  return (
    <authContext.Provider
      value={{
        isLoggedIn: !!token,
        creatorId: userId,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Users />} />
            {token && (
              <>
                <Route path="/:uid/places" element={<UsersPlaces />} />
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
            <Route path="/:uid/places" element={<UsersPlaces />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
            <Route path="/auth" element={<Authenticate />} />
          </Routes>
        </main>
      </Router>
    </authContext.Provider>
  );
}
export default App;
