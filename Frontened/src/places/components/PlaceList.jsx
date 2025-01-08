import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";
const PlaceList = (props) => {
  if (props.places.length === 0)
    return (
      <div className="place-list center">
        <Card>
          <h2> No places found. Maybe want to Create One??</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );

  return (
    <ul className="place-list">
      {props.places.map((place) => (
        <PlaceItem
          key={place.id} // Ensure each place has a unique ID
          place={place.title}
          description={place.description} // Corrected typo
          image={place.image} // Corrected typo
          address={place.address}
          location={place.location}
          uid={place.creatorId}
          id={place.id}
        />
      ))}
    </ul>
  );
};
export default PlaceList;
