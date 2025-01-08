import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import useForm from "../../shared/hooks/useForm";
import Button from "../../shared/components/FormElements/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";
import { useHttp } from "../../shared/hooks/http-hook";
import { useContext } from "react";
import authContext from "../../shared/context/auth-context";
import "./Authenticate.css";
const Authenticate = () => {
  const auth = useContext(authContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  const navigate = useNavigate();

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // Switching to Login mode
      setFormData(
        {
          ...formState.inputs,
          name: undefined, // Remove the name field
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      // Switching to Sign-up mode
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false // Form is initially invalid for sign-up
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  ); // InitialValidity

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (!isLoginMode) {
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(data.user._id);
        navigate("/");
      } catch (err) {}
    } else {
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(data.user._id);
        navigate("/");
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Authenticate;
