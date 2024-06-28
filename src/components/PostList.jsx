import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserIcon from "../images/user-icon.jpg";
import { useSelector } from "react-redux";
import { FaTrashAlt, FaPlus, FaEdit, FaEye, FaPaperPlane } from "react-icons/fa";
import { format } from "date-fns"; // Import fungsi format dari date-fns

function PostList() {
  const { user } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    userId: "",
    image: null,
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State untuk komentar baru
  const [postIdForComments, setPostIdForComments] = useState(null); // State untuk menyimpan postId yang sedang ditampilkan komentarnya

  const [loadingComments, setLoadingComments] = useState(true);

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/posts");
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to fetch posts");
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      getPosts();
      toast.success("Post Deleted Successfully", { autoClose: 2000 });
      document.getElementById("confirm_delete_modal").close();
    } catch (error) {
      toast.error("Delete Failed", { autoClose: 2000 });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "",
      userId: "",
      image: null,
    });
    setIsEditMode(false);
    setEditingPostId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("userId", form.userId);
    if (form.image) formData.append("image", form.image);

    try {
      if (isEditMode) {
        await axios.patch(`http://localhost:5000/posts/${editingPostId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Post Updated Successfully", { autoClose: 2000 });
      } else {
        await axios.post("http://localhost:5000/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Post Created Successfully", { autoClose: 2000 });
      }
      getPosts();
      document.getElementById("post_modal").close();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      toast.error("Operation Failed", { autoClose: 2000 });
    }
  };

  const handleSendComment = async () => {
    try {
      // Validasi bahwa content tidak boleh kosong
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

      const response = await axios.post(`http://localhost:5000/comments`, commentData);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response ? error.response.data : error.message);
      toast.error("Failed to add comment");
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
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

  // Fungsi untuk menutup modal komentar
  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  const openEditModal = (post) => {
    setIsEditMode(true);
    setEditingPostId(post.id);
    setForm({
      title: post.title,
      description: post.description,
      status: post.status,
      userId: post.userId,
      image: null,
    });
    document.getElementById("post_modal").showModal();
  };

  const openCreateModal = () => {
    resetForm();
    document.getElementById("post_modal").showModal();
  };

  const openDeleteModal = (id) => {
    setPostIdToDelete(id);
    document.getElementById("confirm_delete_modal").showModal();
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="flex justify-end mb-5">
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-normal py-2 px-4 rounded flex items-center"
          onClick={openCreateModal}
        >
          <FaPlus className="mr-2" />
          Add New Post
        </button>
      </div>
      <div className="container mx-auto mt-5">
        {posts.length === 0 ? (
          <div className="card card-bordered border-pink-600 bg-slate-800 p-5 text-center text-xl text-gray-300 mt-5">
            You haven't posted anything yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {posts.map((post, postIdx) => (
              <div
                key={postIdx}
                className="card w-full bg-slate-800 shadow-xl rounded-lg overflow-hidden"
              >
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
                    {post.status}
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
                    <>
                      <button
                        className="btn btn-sm btn-outline btn-secondary ml-2"
                        onClick={() => openCommentsModal(post.id)} // Buka modal komentar
                        title="View Comments"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() => openEditModal(post)}
                        title="Update"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error ml-2"
                        onClick={() => openDeleteModal(post.id)}
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <dialog id="post_modal" className="modal">
        <div className="modal-box bg-slate-800">
          <form onSubmit={handleSubmit}>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="button"
              onClick={() => document.getElementById("post_modal").close()}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-3">{isEditMode ? "Edit Post" : "Add New Post"}</h3>
            <div className="mb-3">
              <label className="label">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="input input-bordered text-black w-full focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div className="mb-3">
              <label className="label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                className="textarea textarea-bordered text-black w-full focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="label">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="input input-bordered text-black w-full focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div className="mb-3">
              <label className="label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="select select-bordered text-black w-full focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select Status</option>
                <option value="draft">Draft - (Only Me)</option>
                <option value="private">Private - (Only for Students)</option>
                <option value="public">Public - (For Students and Lecturers)</option>
              </select>
            </div>

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white font-normal py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
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
                    className={`chat ${
                      comment.userId === user.id ? "chat-end justify-end" : "chat-start"
                    }`}
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

      <ToastContainer />
    </div>
  );
}

export default PostList;
