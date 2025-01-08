import UserList from "../components/UserList";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttp } from "../../shared/hooks/http-hook";
const Users = () => {
  const [userData, setUserData] = useState([]);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();
  useEffect(() => {
    const RequestingFetch = async () => {
      try {
        const response = await sendRequest("http://localhost:5000/api/users");
        setUserData(response.users);
      } catch (err) {
        console.log(err);
      }
    };
    RequestingFetch();
  }, [sendRequest]);
  return (
    <>
      <ErrorModal onClear={ErrorHandler} error={error} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && userData && <UserList items={userData} />}
    </>
  );
};

export default Users;
