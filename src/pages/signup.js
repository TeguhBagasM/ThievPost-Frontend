import React from "react";
import Navbar from "../components/Navbar";
import SignupForm from "../components/Signup"; // Ubah nama komponen Login di sini

function Signup() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <div className="p-4">
        <SignupForm />
      </div>
    </div>
  );
}

export default Signup;
