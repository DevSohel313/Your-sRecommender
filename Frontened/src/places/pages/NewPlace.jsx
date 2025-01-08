import Input from "../../shared/components/FormElements/Input";
import "./PlaceForm.css";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/useForm";
import { useContext } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import authContext from "../../shared/context/auth-context";
// Reducer function for managing form state
import { useHttp } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
const NewPlace = () => {
  const navigate = useNavigate();
  const auth = useContext(authContext);
  // Reducer for form state
  const { isLoading, error, ErrorHandler, sendRequest } = useHttp();
  const [formState, inputHandler] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
    },
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await sendRequest(
        "http://localhost:5000/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creatorId: auth.creatorId,
          image:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PFRUWFhURFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDQ0NDg0NDisZFRktKystKy0tLSsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAAAQIDB//EABcQAQEBAQAAAAAAAAAAAAAAAAABEQL/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APDpGpEjUAxcVaKzi4oImGNFBnDGsQVMTGigzhimCJiY0gqYYoCYmNAM4mNAM4Y0gMjSAgoIgAAACKgAANctxjluCqKQBUkawCQIoiIoCI0gJUDAQUBFEFAAEqoAioAACAAIqAACAIAADfLcY4bgqkiLAaEWCCykAVLABMTCgJRbUBKUAQAUAARUARQEAAQAEUBABBFQAAG+G4xw3BVAgjUEWAsBQRGqzQKisgFKAhoAIqChqLAEAAEAABAAEVAABBFQAAG+W2OWxSLEaEFhoClJQBK1WAVKaAiKlABAVAFAQCgAIoCAgAAAIAAIIqAAA3y2xy3BSNRlRGhlQUgAGGpoCWrqAaIgKRAUoIClCggACKgAIAAAioAAIIqAAA1y6Rz5bgqqhAVUAU0BAQAEoAgACoKAAgAAAIAAgAAAIAgAAioAADXLcYjUFaBNBVQAWVFEBABAAAFEUARagBQBAAEVAAAEAAAQAARUAABqNRiNQVoABUUAAAAEC0oIqAAAAACAACAqAACAACAAAAIAAACxqMxQaVlRVEUAAAKAAgAAAICiAAAggCgAIAAAIAAioAAAAAqoA0ICtCaAqs6A1qIaCiaACAKIAqAACAogCoAgAAAAgAAAAAAAoABoAaaALpoAaABqABpoAAAAAAAAAAAIAAAAAAAAAAAP/9k=",
        }),
        { "Content-Type": "application/json" }
      );
    } catch (err) {
      console.log(err);
    }
    navigate("/");
  };
  // Memoize input handler to avoid unnecessary re-render
  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      <form className="place-form" onSubmit={handleSubmit}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
        />
        <Input
          id="description"
          type="text"
          label="Description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description with a minimum length of 5 characters"
          onInput={inputHandler} // Pass inputHandler to the Input component
        />
        <Input
          id="address"
          type="text"
          label="Address"
          element="input"
          validators={[VALIDATOR_REQUIRE]}
          errorText="Please enter a valid address"
          onInput={inputHandler} // Pass inputHandler to the Input component
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
