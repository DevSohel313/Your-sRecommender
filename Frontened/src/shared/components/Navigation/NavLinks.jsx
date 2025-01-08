import { NavLink } from "react-router-dom";
import { useContext } from "react";
import authContext from "../../context/auth-context";
import Button from "../FormElements/Button";
import "./NavLinks.css";
const NavLinks = () => {
  const auth = useContext(authContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">All Users</NavLink>
      </li>

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Place</NavLink>
        </li>
      )}
      <li>
        <NavLink to={`/${auth.creatorId}/places`}>My Places</NavLink>
      </li>

      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">My Authenticate</NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
