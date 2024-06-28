import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserIcon from "../images/user-icon.jpg";
import { format } from "date-fns"; // Import fungsi format dari date-fns
import { useSelector } from "react-redux"; // Import useSelector dari react-redux
// import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTrashAlt,
  FaSearch,
  FaPaperPlane,
} from "react-icons/fa";

function PostListAll() {
  const { user } = useSelector((state) => state.auth); // Ambil user dari state Redux
  // const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State untuk komentar baru
  const [postIdForComments, setPostIdForComments] = useState(null); // State untuk menyimpan postId yang sedang ditampilkan komentarnya

  const [loadingComments, setLoadingComments] = useState(true);

  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8); // Jumlah postingan per halaman

  // State untuk modal pencarian dan komentar
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allposts");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch posts");
        setLoading(false);
      }
    };

    fetchData();
  }, [newComment]); // Menambahkan newComment ke dalam dependencies

  // Fungsi untuk melakukan pencarian berdasarkan input pengguna
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
        post.user.fullname.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(results);
  };

  // Fungsi untuk membuka modal pencarian
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  // Fungsi untuk menutup modal pencarian
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // Fungsi untuk membuka modal komentar
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

  // Fungsi untuk menangani perubahan input komentar baru
  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  // Fungsi untuk mengirim komentar baru
  const handleSendComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment", { autoClose: 2000 });
      return;
    }

    const commentData = {
      content: newComment,
      userId: user.id,
      postId: postIdForComments,
    };

    console.log("Sending comment data:", commentData);

    try {
      const response = await axios.post(`http://localhost:5000/comments`, commentData);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response ? error.response.data : error.message);
      toast.error("Failed to add comment");
    }
  };

  // Logika untuk menampilkan postingan sesuai halaman saat ini
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    searchResults.length > 0
      ? searchResults.slice(indexOfFirstPost, indexOfLastPost)
      : posts.slice(indexOfFirstPost, indexOfLastPost);

  // Mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      // Ambil ulang data setelah menghapus
      const newPosts = posts.filter((post) => post.id !== id);
      setPosts(newPosts);
      toast.success("Post Deleted Successfully", { autoClose: 2000 });
      // Tutup modal setelah berhasil menghapus
      document.getElementById("confirm_delete_modal").close();
    } catch (error) {
      toast.error("Delete Failed", { autoClose: 2000 });
    }
  };

  const openDeleteModal = (id) => {
    setPostIdToDelete(id);
    // Panggil showModal untuk membuka modal
    document.getElementById("confirm_delete_modal").showModal();
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
                    <img src={UserIcon} alt="profile" />
                  </div>
                </div>
                <div className="ml-3 text-sm text-white">{post.user.fullname}</div>
              </div>
              <span
                className={`badge ${
                  post.status === "public" ? "badge-info" : "badge-error"
                } text-xs capitalize`}
              >
                {post.status === "private" ? "only students" : post.status}
              </span>
            </div>
            <figure>
              <img src={post.url} alt="post" className="w-full h-48 object-cover" />
            </figure>
            <div className="card-body p-4">
              <h2 className="card-title text-lg font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-sm text-gray-300">{post.description}</p>
              <div className="flex justify-between text-xs text-gray-400 mt-0">
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
              <div className="card-actions justify-end mt-4">
                {user && user.role === "admin" && (
                  <>
                    <button
                      className="btn btn-sm btn-outline btn-secondary ml-2"
                      onClick={() => openCommentsModal(post.id)} // Buka modal komentar
                      title="View Comments"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error ml-2"
                      onClick={() => openDeleteModal(post.id)}
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </>
                )}
                {user && user.role !== "admin" && (
                  <>
                    <button
                      className="btn btn-sm btn-outline btn-secondary ml-2"
                      onClick={() => openCommentsModal(post.id)} // Buka modal komentar
                      title="View Comments"
                    >
                      <FaEye />
                    </button>
                  </>
                )}
              </div>
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

      <dialog id="confirm_delete_modal" className="modal">
        <div className="modal-box bg-slate-800">
          <h3 className="font-bold text-lg mb-3">Confirm Delete</h3>
          <p className="mb-3">Are you sure you want to delete this post?</p>
          <div className="flex justify-end">
            <button
              className="btn btn-sm bg-gray-600 text-white hover:bg-gray-400 mr-2"
              onClick={() => document.getElementById("confirm_delete_modal").close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm bg-red-600 text-white hover:bg-red-400"
              onClick={() => deletePost(postIdToDelete)}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>

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
                  <p className="font-bold text-xl">No comments yet</p>
                  <p>Start a conversation</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`chat ${comment.userId === user.id ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble ${
                        comment.userId === user.id ? "chat-bubble-info" : "chat-bubble-secondary"
                      }`}
                    >
                      <div className="chat-header">
                        <span className="chat-username">{comment.user?.fullname}, </span>
                        <span className="chat-timestamp">
                          {format(new Date(comment.createdAt), "dd MMM yyyy HH:mm:ss")}
                        </span>
                      </div>
                      <div className="chat-content">{comment.content}</div>
                    </div>
                  </div>
                ))
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="comment"
                  value={newComment}
                  onChange={handleInputChange}
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

// Komponen Pagination
const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
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
};

export default PostListAll;
