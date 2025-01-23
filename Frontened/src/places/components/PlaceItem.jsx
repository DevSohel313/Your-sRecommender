import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { useState, useEffect } from "react";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
import { useHttp } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
const PlaceItem = (props) => {
  const { isLoading, error, Errorhandler, sendRequest } = useHttp();
  const auth = useContext(authContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ratings, setRatings] = useState({
    likes: props.totalLikes || 0,
    dislikes: props.totalDislikes || 0,
  });

  const [userRating, setUserRating] = useState(null);
  useEffect(() => {
    const fetchUserRating = async () => {
      if (auth.isLoggedIn && auth.token && props.id) {
        // Add props.id check
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/places/${props.id}/userrating`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          setUserRating(responseData.rating);
        } catch (err) {
          // Don't do anything with the error, let the useHttp hook handle it
        }
      }
    };
    fetchUserRating();
  }, [auth.isLoggedIn, auth.token, props.id, sendRequest]);

  const handleRate = async (rating) => {
    if (!auth.isLoggedIn) {
      // You could redirect to login or show a message
      return;
    }

    try {
      const response = await sendRequest(
        `http://localhost:5000/api/places/${props.id}/rate`,
        "POST",
        JSON.stringify({ rating }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setRatings({
        likes: response.totalLikes,
        dislikes: response.totalDislikes,
      });
      setUserRating(rating);
    } catch (err) {
      console.log("Rating failed:", err);
    }
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log("Deleting place failed!!", err.message);
    }
  };
  const openMaphandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };
  return (
    <>
      <ErrorModal onClear={Errorhandler} error={error} />
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
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.place}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.place}</h2>
            <h2>{props.address}</h2>
            <p>{props.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleRate(1)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                  userRating === 1
                    ? "bg-green-500 text-white"
                    : "bg-green-100 hover:bg-green-200"
                }`}
                disabled={!auth.isLoggedIn}
              >
                <span>👍</span>
                <span>{ratings.likes}</span>
              </button>
              <button
                onClick={() => handleRate(-1)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                  userRating === -1
                    ? "bg-red-500 text-white"
                    : "bg-red-100 hover:bg-red-200"
                }`}
                disabled={!auth.isLoggedIn}
              >
                <span>👎</span>
                <span>{ratings.dislikes}</span>
              </button>
            </div>
          </div>
          <div className="place-item__actions">
            {/* Your existing buttons */}
            <Button inverse onClick={openMaphandler}>
              VIEW ON MAP
            </Button>
            {auth.creatorId === props.uid && (
              <Button to={`/places/${props.id}`}>EDIT PLACE</Button>
            )}
            {auth.creatorId === props.uid && (
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
