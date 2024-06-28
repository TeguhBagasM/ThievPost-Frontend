import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  // Navigate,
  // Outlet,
} from "react-router-dom";
import Home from "../pages/home";
import Post from "../pages/post";
import Postall from "../pages/postall";
import Dashboard from "../pages/dashboard";
import User from "../pages/user";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Comment from "../pages/comment";

function Router() {
  //   const PrivateRoute = () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       return <Outlet />;
  //     } else {
  //       Swal.fire("Warning", "Please login first", "error");
  //       return <Navigate to='/login' />;
  //     }
  //   };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/allposts" element={<Postall />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts/:postId/comments" element={<Comment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
