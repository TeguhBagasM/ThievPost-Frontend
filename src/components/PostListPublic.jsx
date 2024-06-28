import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserIcon from "../images/user-icon.jpg";
import { format } from "date-fns"; // Import fungsi format dari date-fns
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

function PostListPublic() {
  const { user } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8); // Jumlah postingan per halaman
  // State untuk modal pencarian
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

  // Fungsi untuk melakukan pencarian berdasarkan input pengguna
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const results = posts.filter((post) =>
      post.title.toLowerCase().includes(event.target.value.toLowerCase())
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

  // Logika untuk menampilkan postingan sesuai halaman saat ini
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    searchResults.length > 0
      ? searchResults.slice(indexOfFirstPost, indexOfLastPost)
      : posts.slice(indexOfFirstPost, indexOfLastPost);

  // Mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                className={`badge ${post.status === "public" ? "badge-info" : "badge-error"} text-xs`}
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
            placeholder="Search by title..."
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

export default PostListPublic;
