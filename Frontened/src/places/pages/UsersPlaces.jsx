import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";

const UsersPlaces = ({ searchResults, onClearSearch }) => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const { uid } = useParams();

  const deletePlace = async (placeId) => {
    try {
      setLoadedPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
    } catch (err) {}
  };

  useEffect(() => {
    if (!searchResults) {
      const fetchPlaces = async () => {
        try {
          const responseData = await sendRequest(
            `${import.meta.env.VITE_BACKENED_URL}/places/user/${uid}`
          );

          setLoadedPlaces(responseData.places);
        } catch (err) {}
      };
      fetchPlaces();
    }
  }, [sendRequest, uid, searchResults]);

  return (
    <>
      <ErrorModal error={error} onClear={ErrorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {searchResults ? (
        <PlaceList places={searchResults} onDelete={deletePlace} />
      ) : (
        !isLoading &&
        loadedPlaces && (
          <PlaceList places={loadedPlaces} onDelete={deletePlace} />
        )
      )}
    </>
  );
};

export default UsersPlaces;
