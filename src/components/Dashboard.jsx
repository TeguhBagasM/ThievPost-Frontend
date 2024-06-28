import React from "react";
import Logo from "../images/logo.jpeg";
import { useSelector } from "react-redux";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-20 w-auto mb-4" src={Logo} alt="logo" />
        <h2 className="text-center text-3xl font-extrabold text-gray-100">
          Welcome, {user && user.role}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-center text-2xl capitalize font-extrabold text-gray-100">
              {user && user.fullname}
            </h2>
            <p className="mt-4 text-center text-gray-300">You're logged in as {user && user.role}s.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
