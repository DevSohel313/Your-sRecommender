// Users.js
import UserList from "../components/UserList";
import PlaceList from "../../places/components/PlaceList";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttp } from "../../shared/hooks/http-hook";

const Users = ({ searchResults, onClearSearch }) => {
  const [userData, setUserData] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();

  useEffect(() => {
    const RequestingFetch = async () => {
      try {
        const response = await sendRequest("http://localhost:5000/api/users");
        setUserData(response.users);
      } catch (err) {
        console.log(err);
      }
    };
    RequestingFetch();
  }, [sendRequest]);

  // Clear search results when component unmounts
  useEffect(() => {
    return () => {
      if (onClearSearch) {
        onClearSearch();
      }
    };
  }, [onClearSearch]);

  if (searchResults) {
    return (
      <>
        <ErrorModal onClear={ErrorHandler} error={error} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        <div className="place-list-container">
          <h2 className="text-xl font-bold mb-4 text-center">
            {searchResults.length === 0 ? "No places found" : "Search Results"}
          </h2>
          <PlaceList places={searchResults} />
        </div>
      </>
    );
  }

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && userData && <UserList items={userData} />}
    </>
  );
};
export default Users;
