import PlaceList from "./places/components/PlaceList";
import Users from "./user/pages/Users";

const Home = ({ searchResults, setSearchResults }) => {
  console.log("Home component searchResults:", searchResults);

  if (searchResults && searchResults.length >= 0) {
    return (
      <div className="places-container">
        <h2 className="text-xl font-bold mb-4">
          {searchResults.length === 0 ? "No places found" : "Search Results"}
        </h2>
        <PlaceList
          places={searchResults}
          onClearSearch={() => setSearchResults(null)}
        />
      </div>
    );
  }

  return <Users />;
};

export default Home;
