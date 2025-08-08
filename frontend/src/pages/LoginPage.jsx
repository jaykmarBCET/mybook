import { useEffect, useState } from "react";
import useUserStore from "../../store/user/User.api";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { Link } from "react-router-dom";

function LoginPage() {
  const { user, login, currentUser, isLoading, error } = useUserStore();  // Make sure `error` is part of your store
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async () => {
    if (!userInfo.email || !userInfo.password) {
      alert("Please fill in both email and password.");
      return;
    }
    
    try {
      await login(userInfo);
    } catch (err) {
      console.error("Login failed", err);  // Optional: show error to user
      alert("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    currentUser();
  }, [currentUser]);

  useEffect(() => {
    if (user?.email) {
      navigate("/home");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <BounceLoader size={100} color="#33454635" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col sm:w-64 md:w-72 w-96 border border-gray-300   h-96 bg-gray-100 rounded-2xl justify-around">
        <h1 className="text-xl font-bold text-center px-2 pt-4">Login</h1>
        <div className="flex flex-col px-2">
          <input
            className="px-4 py-2 text-sm font-sans text-blue-500 mt-2 border outline-none border-gray-300 rounded-2xl text-center"
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <input
            className="px-4 py-2 text-sm font-sans text-blue-500 mt-2 border outline-none border-gray-300  rounded-2xl text-center"
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>
        <button
          onClick={submitHandler}
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 mx-auto rounded-2xl"
        >
          Login
        </button>
        <div className="flex flex-col mx-auto">
          <Link
            className="py-1 text-blue-500 cursor-pointer  my-1 px-2 rounded-2xl text-xs text-shadow"
            to={"/reset-my-password"}
          >
            Reset my password
          </Link>
          <Link
            className="py-1 text-blue-500 cursor-pointer my-1 px-2 rounded-2xl text-xs text-shadow"
            to={"/register"}
          >
            Don't have an account
          </Link>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
