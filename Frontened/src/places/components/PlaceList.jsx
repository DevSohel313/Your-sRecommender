import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";
import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
import { Link, useNavigate } from "react-router-dom";
const PlaceList = (props) => {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  // console.log("sds", props.places[0]._id);
  if (props.places.length === 0)
    return (
      <div className="place-list center">
        <Card>
          <h2 className="text-lg font-bold text-gray-700">
            No places found. Would you like to create one?
          </h2>
          {auth.isLoggedIn ? (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <Button
                to="/places/new"
                className="mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
              >
                Add Your First Place Here!!
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center ">
              <h2 className="text-lg font-bold text-gray-700">
                Please log in first to add a place.
              </h2>
              <Link
                to="/auth"
                className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-blue-600"
              >
                Login
              </Link>
            </div>
          )}
        </Card>
      </div>
    );

  return (
    <ul className="place-list">
      {props.places.map((place) => {
        return (
          <PlaceItem
            key={place._id} // Ensure each place has a unique ID
            place={place.title}
            description={place.description} // Corrected typo
            image={place.image} // Corrected typo
            address={place.address}
            location={place.location}
            uid={place.creatorId}
            id={place._id}
            onDelete={props.onDelete}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
