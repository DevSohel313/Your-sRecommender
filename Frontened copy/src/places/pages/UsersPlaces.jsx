import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";
const UsersPlaces = () => {
  let [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const { uid } = useParams();
  const [searchType, setSearchType] = useState("title"); // Default search by title
  const [searchQuery, setSearchQuery] = useState("");

  const deletePlace = async (placeId) => {
    try {
      setLoadedPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
    } catch (err) {}
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/search?type=${searchType}&query=${searchQuery}`
      );
      setLoadedPlaces(responseData.places);
    } catch (err) {}
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${uid}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, uid]);

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      <div className="search-container">
        <form onSubmit={searchHandler}>
          <div>
            <label htmlFor="type">Search By:</label>
            <select
              id="type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="city">City</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit">Search</button>
        </form>
      </div>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList places={loadedPlaces} />}
    </>
  );
};
export default UsersPlaces;
