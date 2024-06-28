import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../images/logo.jpeg";
import { useSelector } from "react-redux";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user) {
          const responsePosts = await axios.get(`http://localhost:5000/posts/user/${user.id}/count`);
          const responseLikes = await axios.get(`http://localhost:5000/likes/user/${user.id}/count`);
          setTotalPosts(responsePosts.data.totalPosts);
          setTotalLikes(responseLikes.data.totalLikes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
            <h2 className="text-center text-2xl font-extrabold text-gray-100">
              {user && user.fullname}
            </h2>
            <p className="mt-4 text-center text-gray-300">You're logged in as {user && user.role}.</p>
            <div className="mt-6">
              <div className="bg-slate-900 rounded-lg shadow-md p-6">
                <div className="mb-8">
                  <h3 className="text-center text-xl font-bold text-gray-100">Total Posts</h3>
                  {loading ? (
                    <p className="mt-2 text-center text-gray-300">Loading...</p>
                  ) : (
                    <p className="mt-2 text-center text-3xl font-extrabold text-pink-500">
                      {totalPosts}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-center text-xl font-bold text-gray-100">Total Likes</h3>
                  {loading ? (
                    <p className="mt-2 text-center text-gray-300">Loading...</p>
                  ) : (
                    <p className="mt-2 text-center text-3xl font-extrabold text-pink-500">
                      {totalLikes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
