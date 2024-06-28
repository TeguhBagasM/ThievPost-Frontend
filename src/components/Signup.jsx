import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Logo from "../images/logo.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role] = useState("student"); // Set nilai default untuk role
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    e.preventDefault();
    // Validasi email dan password tidak boleh kosong
    if (!fullname) {
      setMsg("Fullname is required");
      return;
    }
    if (!email) {
      setMsg("Email is required");
      return;
    }
    if (!password) {
      setMsg("Password cannot be empty");
      return;
    }
    try {
      await axios.post("http://localhost:5000/signup", {
        fullname: fullname,
        email: email,
        password: password,
        confPassword: confPassword,
        role: role,
      });
      toast.success("Registration Successfully", { autoClose: 3000 });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img className="mx-auto h-24 w-24 rounded-full mb-6" src={Logo} alt="logo" />{" "}
        <h2 className="text-3xl font-extrabold text-pink-600">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={signUp} className="space-y-6">
            <p className="text-center text-red-500">{msg}</p>
            <div className="flex items-center">
              <FaUser className="mr-2 text-pink-500" />
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-400">
                Full Name
              </label>
            </div>
            <div className="mt-1">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-black"
              />
            </div>

            <div className="flex items-center mt-4">
              <FaEnvelope className="mr-2 text-pink-500" />
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email address
              </label>
            </div>
            <div className="mt-1">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-black"
              />
            </div>

            <div className="flex items-center mt-4">
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
            <div className="flex items-center mt-4">
              <FaLock className="mr-2 text-pink-500" />
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Confirm Password
              </label>
            </div>
            <div className="mt-1">
              <input
                type="password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Sign up
              </button>
              <p className="mt-2 text-center text-sm text-gray-300">
                Already have an account?{" "}
                <NavLink to="/login" className="font-medium text-pink-400 hover:text-pink-500">
                  Log in
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
