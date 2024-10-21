import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Profile() {
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `http://localhost:5130/user/upload-avatar/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cập nhật avatar sau khi upload thành công
      if (data.success) {
        const updatedUser = { ...user, avatar: data.avatar };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setFormData({ ...formData, avatar: data.avatar });
      } else {
        setError("Failed to upload avatar");
      }
    } catch (err) {
      setError("Upload failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:5130/user/update/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Cập nhật thông tin người dùng và lưu vào localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUpdateSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            formData.avatar || user.avatar || "https://via.placeholder.com/150"
          }
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <input
          type="text"
          placeholder="username"
          defaultValue={user.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={user.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          defaultValue={user.role}
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="address"
          defaultValue={user.address}
          id="address"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="tel"
          placeholder="phone"
          defaultValue={user.phone}
          id="phone"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/register-car"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between float-end mt-5">
        <span onClick={logoutUser} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">User is updated successfully!</p>
      )}
    </div>
  );
}
