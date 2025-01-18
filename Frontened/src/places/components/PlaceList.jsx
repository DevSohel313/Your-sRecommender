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

  if (props.places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2 className="text-lg font-bold text-gray-700">No places found.</h2>
          {props.onClearSearch && (
            <Button
              onClick={props.onClearSearch}
              className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
            >
              Clear Search
            </Button>
          )}
          {auth.isLoggedIn && (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <Button
                to="/places/new"
                className="mt-4 bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
              >
                Add Your First Place Here!!
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <>
      {props.onClearSearch && (
        <div className="mb-4">
          <Button
            onClick={props.onClearSearch}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
          >
            Clear Search
          </Button>
        </div>
      )}
      <ul className="place-list">
        {props.places.map((place) => (
          <PlaceItem
            key={place._id}
            place={place.title}
            description={place.description}
            image={place.image}
            address={place.address}
            location={place.location}
            uid={place.creatorId}
            id={place._id}
            onDelete={props.onDelete}
          />
        ))}
      </ul>
    </>
  );
};

export default PlaceList;
