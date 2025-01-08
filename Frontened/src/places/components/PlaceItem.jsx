import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";

import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { useState } from "react";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
const PlaceItem = (props) => {
  const auth = useContext(authContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log("DELETING...");
  };
  const openMaphandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };
  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        className="w-3/4 max-w-xl"
        footer={
          <Button className="bg-blue-500 text-white" onClick={closeMapHandler}>
            CLOSE
          </Button>
        }
      >
        <div className="map-container">
          <h2>
            <Map center={props.location} zoom={16} />
          </h2>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.place} />
          </div>
          <div className="place-item__info">
            <h2>{props.place}</h2>
            <h2>{props.address}</h2>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMaphandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/places/${props.id}`}>EDIT PLACE</Button>
            )}
            {auth.isLoggedIn && (
              <Button onClick={showDeleteWarningHandler} danger>
                DELETE PLACE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
