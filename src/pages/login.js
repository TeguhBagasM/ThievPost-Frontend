import React from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/Login"; // Ubah nama komponen Login di sini

function Login() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <div className="p-4">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
