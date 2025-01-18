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
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";
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
      let formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest("http://localhost:5000/api/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
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
        <ImageUpload id="image" center onInput={inputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
