import { createContext } from "react";
const authContext = createContext({
  isLoggedIn: false,
  creatorId: null,
  login: () => {},
  logout: () => {},
});

export default authContext;
