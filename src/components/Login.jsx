import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, reset } from "../features/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Logo from "../images/logo.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // distract langsung disini
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
    // denpendency
  }, [user, isSuccess, dispatch, navigate]);
  // (e) = tangkap eventnya
  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img className="mx-auto h-24 w-24 rounded-full mb-6" src={Logo} alt="logo" />{" "}
        <h2 className="text-3xl font-extrabold text-pink-600">Sign In</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={Auth} className="space-y-6">
            {isError && <p className="text-center text-red-500">{message}</p>}
            <div className="flex items-center">
              <FaEnvelope className="mr-2 text-pink-500" />
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email address
              </label>
            </div>
            <div className="mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-black"
              />
            </div>

            <div className="mt-4 flex items-center">
              <FaLock className="mr-2 text-pink-500" />
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
            </div>
            <div className="mt-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <NavLink to="/signup" className="font-medium text-pink-500 hover:text-pink-600">
                  Sign Up
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
