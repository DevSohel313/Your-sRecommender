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

  const deletePlace = async (placeId) => {
    try {
      setLoadedPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
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
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList places={loadedPlaces} onDelete={deletePlace} />
      )}
    </>
  );
};

export default UsersPlaces;
