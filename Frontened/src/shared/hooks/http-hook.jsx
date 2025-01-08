import { useEffect, useState, useCallback, useRef } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      const signal = httpAbortController.signal;
      activeHttpRequests.current.push(httpAbortController);

      try {
        let response = await fetch(url, { method, body, headers, signal });
        let data = await response.json();

        // Filter out the request controller that has completed.
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        setIsLoading(false);
        return data;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const ErrorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    // Cleanup function: abort active requests when the component unmounts.
    return () => {
      activeHttpRequests.current.forEach((req) => req.abort());
    };
  }, []); // Empty dependency array means this only runs when the component unmounts

  return { error, isLoading, sendRequest, ErrorHandler };
};
