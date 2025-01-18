import { useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import SearchBar from "../../../places/pages/SearchBar";
import { FcHome } from "react-icons/fc";
import { MapPin, Search, Menu } from "lucide-react";

const MainNavigation = ({ onSearch, onClearSearch }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => setDrawerIsOpen(true);
  const closeDrawer = () => setDrawerIsOpen(false);

  return (
    <>
      {drawerIsOpen && (
        <SideDrawer closeDrawer={closeDrawer}>
          <nav className="main-navigation__drawer-nav">
            <NavLinks onClearSearch={onClearSearch} />
          </nav>
        </SideDrawer>
      )}
      <MainHeader>
        <button
          className="main-navigation__menu-btn p-2 hover:bg-gray-100 rounded-full"
          onClick={openDrawer}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="main-navigation__title">
          <Link
            to="/"
            onClick={onClearSearch}
            className="flex items-center gap-2 text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            <MapPin className="w-8 h-8 text-rose-500" />
            <span className="flex flex-col items-start">
              <span className="text-sm font-normal text-gray-500">
                Discover
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                YourPlaces
              </span>
            </span>
          </Link>
        </h1>

        <SearchBar onSearch={onSearch} />

        <nav className="main-navigation__header-nav">
          <NavLinks onClearSearch={onClearSearch} />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
