import React from "react";
import Navbar from "../components/Navbar";
import PostListPublics from "../components/PostListPublic";

function Home() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <div className="p-4">
        <PostListPublics />
      </div>
    </div>
  );
}

export default Home;
