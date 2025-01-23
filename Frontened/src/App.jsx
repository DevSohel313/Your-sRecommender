import { useCallback, useState } from "react";
import TestSpinner from "../TestSpinner";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./user/pages/Users";
import AboutPage from "./user/pages/AboutPage";
import UserProfile from "./user/pages/UserProfile";
import Home from "./Home";
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
import AllPlaces from "./places/pages/AllPlaces";
import authContext from "./shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "./user/pages/UpdateProfile";
import { Navigate } from "react-router-dom";
import { useHttp } from "./shared/hooks/http-hook";
function App() {
  const [userId, setUserId] = useState(null);
  const { sendRequest } = useHttp();
  const [token, setToken] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
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

  const handleSearch = async (searchType, searchQuery) => {
    try {
      console.log("Search initiated with:", searchType, searchQuery);
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/search?type=${searchType}&query=${searchQuery}`
      );
      console.log("Search results:", responseData);

      // Add explicit validation of the response
      if (responseData && Array.isArray(responseData.places)) {
        setSearchResults(responseData.places);
      } else {
        console.warn("Invalid search response format:", responseData);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };
  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
  }, []);
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
        <MainNavigation
          onSearch={handleSearch}
          onClearSearch={clearSearchResults}
        />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Users
                  searchResults={searchResults}
                  onClearSearch={clearSearchResults}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/:uid/places"
              element={
                <UsersPlaces
                  searchResults={searchResults}
                  onClearSearch={clearSearchResults}
                />
              }
            />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/places/all"
              element={
                <AllPlaces
                  searchResults={searchResults}
                  onClearSearch={clearSearchResults}
                />
              }
            />
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
            <Route path="/auth" element={<Authenticate />} />

            {/* Protected Routes */}
            {token ? (
              <>
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:placeId" element={<UpdatePlace />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
              </>
            ) : null}

            {/* Catch-all route - Must be last */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </authContext.Provider>
  );
}

export default App;
