import React from "react";
import UserIcon from "./../images/user-icon.jpg";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <div className="navbar bg-slate-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <NavLink to="/" className="flex items-center space-x-1 text-white">
            <span className="text-xl font-bold">Thiev</span>
            <span className="text-xl bg-gradient-to-r from-pink-500 to-purple-500 font-bold rounded-md px-3 py-1">
              Post
            </span>
          </NavLink>
        </div>
        <div className="relative">
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img className="object-cover w-full h-full" src={UserIcon} alt="Avatar" />
              </div>
            </button>
            <ul className="mt-2 w-48 p-2 shadow-lg menu dropdown-content bg-base-100 rounded-box text-black right-0 z-50">
              {user && user.role === "admin" && (
                <>
                  <li>
                    <NavLink
                      to="/allposts"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      All Posts
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/users"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Users
                    </NavLink>
                  </li>
                </>
              )}
              {user && user.role === "student" && (
                <>
                  <li>
                    <NavLink
                      to="/allposts"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      All Posts
                    </NavLink>
                  </li>
                </>
              )}
              {!user && (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Signup
                    </NavLink>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/posts"
                      className="menu-title block py-1 hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      My Posts
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="menu-title block py-1 w-full text-left hover:bg-pink-200 hover:text-black transition duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
