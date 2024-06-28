import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import UserList from "../components/UserList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <div className="p-4">
        <UserList />
      </div>
    </div>
  );
}

export default Users;
