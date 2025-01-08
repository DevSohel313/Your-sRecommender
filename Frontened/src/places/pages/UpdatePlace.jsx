import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import useForm from "../../shared/hooks/useForm";
import Card from "../../shared/components/UIElements/Card";
import { useHttp } from "../../shared/hooks/http-hook";
import { load } from "ol/Image";

const UpdatePlace = () => {
  const { isLoading, error, ErrorHandler, sendRequest } = useHttp();
  const pid = useParams().pid;
  const [loadedPlace, setLoadedPlace] = useState([]);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  // const identifiedPlace = userplaces.find((p) => p.id === pid);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const repsonse = await sendRequest(
          `http://localhost:5000/api/places/${pid}`
        );
        setLoadedPlace(repsonse.UpdatedPlace);
        setFormData(
          {
            title: {
              value: repsonse.UpdatedPlace.title,
              isValid: true,
            },
            description: {
              value: repsonse.UpdatePlace.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, pid, setFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>Could not find place!</Card>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={handleSubmit}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            Initialvalue={formState.inputs.title.value}
            Initialvalid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            Initialvalue={formState.inputs.description.value}
            Initialvalid={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
