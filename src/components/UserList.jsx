import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confPassword: "",
    role: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      getUsers();
      toast.success("User Deleted Successfully", { autoClose: 2000 });
      document.getElementById("confirm_delete_modal").close();
    } catch (error) {
      toast.error("Delete Failed", { autoClose: 2000 });
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      try {
        await axios.patch(`http://localhost:5000/users/${editingUserId}`, form);
        getUsers();
        toast.success("User Updated Successfully", { autoClose: 2000 });
        document.getElementById("user_modal").close();
        resetForm();
      } catch (error) {
        console.error("Error updating user:", error.response ? error.response.data : error.message);
        toast.error("Update Failed", { autoClose: 2000 });
      }
    } else {
      // Check if password and confPassword match
      if (form.password !== form.confPassword) {
        toast.error("Passwords do not match", { autoClose: 2000 });
        return;
      }
      try {
        await axios.post("http://localhost:5000/users", form);
        getUsers();
        toast.success("User Added Successfully", { autoClose: 2000 });
        document.getElementById("user_modal").close();
        resetForm();
      } catch (error) {
        console.error("Error adding user:", error.response ? error.response.data : error.message);
        toast.error(error.response.data.msg || "Add User Failed", { autoClose: 2000 });
      }
    }
  };

  const resetForm = () => {
    setForm({
      fullname: "",
      email: "",
      password: "",
      confPassword: "",
      role: "",
    });
    setIsEditMode(false);
    setEditingUserId(null);
  };

  const openEditModal = (user) => {
    setForm({
      fullname: user.fullname,
      email: user.email,
      password: "", // Clear password field
      confPassword: "", // Clear confPassword field
      role: user.role,
    });
    setIsEditMode(true);
    setEditingUserId(user.uuid); // Assuming uuid is the unique identifier for editing
    document.getElementById("user_modal").showModal();
  };

  const openDeleteModal = (uuid) => {
    setUserIdToDelete(uuid); // Set uuid instead of userIdToDelete
    document.getElementById("confirm_delete_modal").showModal();
  };

  return (
    <div className="container mx-auto mt-5 px-4">
      <div className="flex justify-end mb-5">
        <Link
          to="#"
          className="bg-pink-600 hover:bg-pink-700 text-white font-normal py-2 px-4 rounded flex items-center"
          onClick={() => {
            resetForm();
            document.getElementById("user_modal").showModal();
          }}
        >
          <FaPlus className="mr-2" /> Add New User
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 text-white border border-pink-600">
          <thead className="border border-pink-600">
            <tr>
              <th className="py-2 px-4">No</th>
              <th className="py-2 px-4">Full Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uuid} className="border-t border-gray-700 text-center">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{user.fullname}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => openDeleteModal(user.uuid)}
                    className="btn btn-sm btn-outline btn-error"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => openEditModal(user)}
                    className="btn btn-sm btn-outline btn-info ml-2"
                    title="Update"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="user_modal" className="modal">
        <div className="modal-box bg-slate-800">
          <form onSubmit={handleSubmit}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("user_modal").close()}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-3">{isEditMode ? "Edit User" : "Add New User"}</h3>
            <div className="mb-3">
              <label className="label">Fullname</label>
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleInputChange}
                placeholder="Enter Fullname"
                className="input input-bordered text-black w-full"
              />
            </div>
            <div className="mb-3">
              <label className="label">Email</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="input input-bordered text-black w-full"
              />
            </div>
            {!isEditMode && (
              <div className="mb-3">
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  className="input input-bordered text-black w-full"
                />
              </div>
            )}
            {!isEditMode && (
              <div className="mb-3">
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confPassword"
                  value={form.confPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="input input-bordered text-black w-full"
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="label">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className="input input-bordered text-black w-full"
              >
                <option>Select Role</option>
                <option value="admin">Admin</option>
                <option value="lecturer">Lecturer</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="card-actions justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog id="confirm_delete_modal" className="modal">
        <div className="modal-box bg-slate-800">
          <h3 className="font-bold text-lg mb-3">Confirm Delete</h3>
          <p className="mb-3">Are you sure you want to delete this user?</p>
          <div className="flex justify-end">
            <button
              className="btn btn-sm bg-gray-600 text-white hover:bg-gray-400 mr-2"
              onClick={() => document.getElementById("confirm_delete_modal").close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm bg-red-600 text-white hover:bg-red-400"
              onClick={() => deleteUser(userIdToDelete)}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>

      <ToastContainer />
    </div>
  );
}

export default UserList;
