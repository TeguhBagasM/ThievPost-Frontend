import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import DashBoard from "../components/Dashboard"; // Ubah nama komponen Dashboard di sini
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <div className="p-4">
        <DashBoard />
      </div>
    </div>
  );
}

export default Dashboard;
