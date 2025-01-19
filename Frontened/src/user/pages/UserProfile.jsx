// UserProfile.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../shared/hooks/http-hook";
import authContext from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { User, MapPin, Calendar, Edit } from "lucide-react";
import "./UserProfile.css";
const UserProfile = () => {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [placeCount, setPlaceCount] = useState(0);
  const { isLoading, error, sendRequest, ErrorHandler } = useHttp();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await sendRequest(
          `http://localhost:5000/api/users/${auth.creatorId}`
        );
        const placesData = await sendRequest(
          `http://localhost:5000/api/places/user/${auth.creatorId}`
        );
        setUserData(userData.user);
        setPlaceCount(placesData.places.length);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (auth.creatorId) {
      fetchUserProfile();
    }
  }, [sendRequest, auth.creatorId]);

  const handleEditClick = () => {
    navigate("/update-profile");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <ErrorModal error={error} onClear={ErrorHandler} />
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userData && (
        <div className="max-w-2xl mx-auto px-4 ">
          <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                  {userData.image ? (
                    <img
                      src={`http://localhost:5000/${userData.image}`}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                      <User size={48} className="text-yellow-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-20 pb-8 px-8">
              <div className="text-center mb-8 relative">
                <button
                  onClick={handleEditClick}
                  className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                  title="Edit Profile"
                >
                  <Edit
                    size={20}
                    className="text-gray-600 hover:text-yellow-600"
                  />
                </button>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {userData.name}
                </h1>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <span className="inline-block">
                    <User size={16} className="inline" />
                  </span>
                  {userData.email}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-yellow-600" />
                    <h3 className="font-semibold text-gray-800">
                      Places Created
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">
                    {placeCount}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Total locations shared with the community
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                      Member Since
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatDate(userData.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Active community member
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserProfile;
