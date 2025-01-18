// SearchBar.js (New component)
import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = (event) => {
    event.preventDefault();
    console.log("SearchBar submitted:", searchType, searchQuery);
    onSearch(searchType, searchQuery);
  };

  return (
    <form onSubmit={searchHandler} className="search-bar">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-select"
      >
        <option value="title">Title</option>
        <option value="city">City</option>
      </select>
      <input
        type="text"
        placeholder="Search places..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
