import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/http-hook";
const UsersPlaces = ({ searchResults }) => {
  let [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const { uid } = useParams();
  if (searchResults) {
    return <PlaceList places={searchResults} />;
  }

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
      {!isLoading && loadedPlaces && <PlaceList places={loadedPlaces} />}
    </>
  );
};
export default UsersPlaces;
