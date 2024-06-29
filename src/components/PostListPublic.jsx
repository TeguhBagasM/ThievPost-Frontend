import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserIcon from "../images/user-icon.jpg";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  FaChevronLeft,
  FaPaperPlane,
  FaChevronRight,
  FaSearch,
  FaHeart,
  FaComment,
} from "react-icons/fa";

function PostListPublic() {
  const { user } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [postIdForComments, setPostIdForComments] = useState(null);

  const [loadingComments, setLoadingComments] = useState(true);

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // State untuk menyimpan status like
  const [likedPosts, setLikedPosts] = useState({});
  const [likedComments, setLikedComments] = useState({});
  const [totalLikes, setTotalLikes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/postpub");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch posts");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Menghitung total likes untuk setiap komentar
    const calculateTotalLikes = () => {
      const likesMap = {};
      comments.forEach((comment) => {
        const likes = Object.keys(likedComments).filter(
          (key) => likedComments[key] && parseInt(key) === comment.id
        );
        likesMap[comment.id] = likes.length;
      });
      setTotalLikes(likesMap);
    };

    calculateTotalLikes();
  }, [comments, likedComments]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const results = posts.filter((post) =>
      post.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSendComment = async () => {
    try {
      if (!newComment.trim()) {
        toast.error("Please enter a comment", { autoClose: 2000 });
        return;
      }

      const commentData = {
        content: newComment,
        userId: user.id,
        postId: postIdForComments,
      };

      const response = await axios.post(`http://localhost:5000/comments`, commentData);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response ? error.response.data : error.message);
      toast.error("Failed to add comment");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const openCommentsModal = async (postId) => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`http://localhost:5000/posts/${postId}/comments`);
      setComments(response.data);
      setLoadingComments(false);
      setIsCommentsModalOpen(true);
      setPostIdForComments(postId);
    } catch (error) {
      toast.error("Failed to fetch comments");
      setLoadingComments(false);
    }
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    searchResults.length > 0
      ? searchResults.slice(indexOfFirstPost, indexOfLastPost)
      : posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fungsi untuk menangani klik like
  const handleLikeClickPosts = (postId) => {
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };
  // Fungsi untuk menangani klik like
  const handleLikeClickComments = (commentId) => {
    setLikedComments((prevLikedComments) => ({
      ...prevLikedComments,
      [commentId]: !prevLikedComments[commentId], // Mengubah status like komentar
    }));
  };

  if (loading) {
    return <div className="container mx-auto mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5">
      <div className="mb-4 flex justify-end items-center">
        <button onClick={openSearchModal} className="btn btn-outline btn-info flex items-center">
          <FaSearch className="mr-2" /> Search
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {currentPosts.map((post, postIdx) => (
          <div key={postIdx} className="card w-full bg-slate-800 shadow-xl rounded-lg overflow-hidden">
            <div className="card-header p-4 flex items-center justify-between bg-slate-900">
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={UserIcon} alt="profil" />
                  </div>
                </div>
                <div className="ml-3 text-sm text-white">{user ? post.user.fullname : "Unknown"}</div>
              </div>
              <span
                className={`badge ${
                  post.status === "public" ? "badge-info" : "badge-error"
                } text-xs capitalize`}
              >
                {post.status}
              </span>
            </div>
            <figure>
              <img src={post.url} alt="post" className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-lg font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-sm text-gray-300">{post.description}</p>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {post.updatedAt ? (
                  <div>{`Updated At: ${format(
                    new Date(post.updatedAt),
                    "dd MMM yyyy HH:mm:ss"
                  )}`}</div>
                ) : (
                  <div>{`Created At: ${format(
                    new Date(post.createdAt),
                    "dd MMM yyyy HH:mm:ss"
                  )}`}</div>
                )}
              </div>
              {user && (
                <div className="card-actions justify-between mt-4">
                  <button
                    className="btn btn-sm btn-outline btn-secondary"
                    onClick={() => openCommentsModal(post.id)}
                    title="View Comments"
                  >
                    <FaComment />
                  </button>
                  <button
                    className={`btn btn-sm btn-ghost hover:bg-slate-700 ${
                      likedPosts[post.id] ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={() => handleLikeClickPosts(post.id)}
                    title="Like Post"
                  >
                    <FaHeart />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={searchResults.length > 0 ? searchResults.length : posts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <ToastContainer />

      <dialog id="search_modal" className="modal" open={isSearchModalOpen}>
        <div className="modal-box bg-slate-800">
          <h3 className="font-bold text-lg mb-3">Search Posts</h3>
          <input
            type="text"
            placeholder="Search by title or fullname..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-3 py-2 w-full text-black sm:w-64 border border-pink-300 rounded-md focus:outline-none focus:ring focus:ring-pink-400 mb-4"
          />
          <div className="flex justify-end">
            <button
              className="btn btn-sm bg-gray-600 text-white hover:bg-gray-400 mr-2"
              onClick={closeSearchModal}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="comments_modal" className="modal" open={isCommentsModalOpen}>
        <div className="modal-box bg-slate-800">
          <h3 className="font-bold text-lg mb-4 text-center">Comments</h3>
          {loadingComments ? (
            <div>Loading comments...</div>
          ) : (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center text-gray-300">
                  <p className="mb-4">No comments yet.</p>
                </div>
              ) : (
                comments.map((comment, commentIdx) => (
                  <div key={commentIdx} className="bg-slate-900 p-2 rounded-md">
                    <div className="flex justify-start items-center mb-2">
                      <div className="text-lg text-gray-200 mr-4">{comment.user.fullname}</div>
                      <span className="text-sm text-gray-400">
                        {format(new Date(comment.createdAt), "dd MMM yyyy HH:mm:ss")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white">{comment.content}</p>
                    </div>
                    <div className="flex justify-end items-center">
                      <button
                        className={`btn btn-sm btn-ghost hover:bg-slate-700 ${
                          likedComments[comment.id] ? "text-red-500" : "text-gray-500"
                        }`}
                        onClick={() => handleLikeClickComments(comment.id)}
                        title="Like Comment"
                      >
                        <FaHeart />
                      </button>
                      <span className="text-sm text-gray-300 mr-2">
                        {totalLikes[comment.id]} {totalLikes[comment.id] === 1 ? "like" : "likes"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {user && (
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                name="comment"
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
                className="input input-bordered text-black w-full focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
              <button
                className="btn btn-sm bg-pink-600 text-white hover:bg-pink-400"
                onClick={handleSendComment}
              >
                <FaPaperPlane />
              </button>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              className="btn btn-sm bg-gray-600 text-white hover:bg-gray-400 mr-2"
              onClick={closeCommentsModal}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function Pagination({ postsPerPage, totalPosts, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="pagination bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-lg shadow-lg flex items-center space-x-2">
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link flex items-center justify-center focus:outline-none text-white"
            disabled={currentPage === 1}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`page-link focus:outline-none ${
                number === currentPage ? "bg-white text-pink-500 font-bold" : "text-white"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li className={currentPage === pageNumbers.length ? "page-item disabled" : "page-item"}>
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link flex items-center justify-center focus:outline-none text-white"
            disabled={currentPage === pageNumbers.length}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default PostListPublic;
