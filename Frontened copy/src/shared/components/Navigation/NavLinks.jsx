import { NavLink } from "react-router-dom";
import { useContext } from "react";
import authContext from "../../context/auth-context";
import Button from "../FormElements/Button";
import "./NavLinks.css";
import { useLocation } from "react-router-dom";
const NavLinks = () => {
  const location = useLocation();
  const auth = useContext(authContext);
  const isForgotPasswordPage = location.pathname === "/user/forgot-password";
  return (
    <ul className="nav-links">
      {isForgotPasswordPage ? (
        <>
          <li>
            <NavLink to="/auth">Back to Login</NavLink>
          </li>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/">All Users</NavLink>
          </li>
          {auth.isLoggedIn && (
            <li>
              <NavLink to="/places/new">Add Place</NavLink>
            </li>
          )}
          {auth.isLoggedIn && (
            <li>
              <NavLink to={`/${auth.creatorId}/places`}>My Places</NavLink>
            </li>
          )}

          {auth.isLoggedIn && (
            <li>
              <button onClick={auth.logout}>Logout</button>
            </li>
          )}
          {!auth.isLoggedIn && (
            <li>
              <NavLink to="/auth">Login</NavLink>
            </li>
          )}
        </>
      )}
    </ul>
  );
};

export default NavLinks;
