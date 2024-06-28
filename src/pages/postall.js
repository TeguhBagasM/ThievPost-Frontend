import React from "react";
import Navbar from "../components/Navbar";
import AllPostLists from "../components/PostListAll";

function PostAll() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <div className="p-4">
        <AllPostLists />
      </div>
    </div>
  );
}

export default PostAll;
