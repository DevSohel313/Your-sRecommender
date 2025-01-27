import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";
import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
const UsersPlaces = ({ searchResults, onClearSearch }) => {
  const auth = useContext(authContext);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const { uid } = useParams();

  const deletePlace = async (placeId) => {
    try {
      // First, verify the place was actually deleted in the backend
      await sendRequest(
        `${import.meta.env.VITE_BACKENED_URL}/places/${placeId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token, // You'll need to get auth context
        }
      );

      // Only update the state after successful deletion
      setLoadedPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
    } catch (err) {
      // Handle any errors
      console.error("Failed to delete place:", err);
    }
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
