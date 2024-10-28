import { useRef, useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { Button, Label } from "flowbite-react";
import { FaExclamationCircle } from "react-icons/fa";
import axios from "axios";

const Profile = () => {
  let api = useAxios();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [licenseFile, setLicenseFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/me");
        setUser(data);
        setFormData(data);
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file, "avatar");
    }
    if (licenseFile && !user.isActive) {
      handleFileUpload(licenseFile, "drivingLicense");
    }
  }, [file, licenseFile]);

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;

    setUploading(true);
    const fileFormData = new FormData();
    fileFormData.append("file", file);
    fileFormData.append(
      "upload_preset",
      import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
    );
    fileFormData.append(
      "cloud_name",
      import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
    );
    fileFormData.append("folder", "Cloudinary-React");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        fileFormData
      );

      const imageUrl = res.data.secure_url;
      setUploading(false);

      // Cập nhật trường tương ứng trong formData
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading the image:", error);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // So sánh `formData` với `user`
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.put("/me", formData);
      const data = response.data;

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      const updatedUser = { ...user, ...formData };
      setUpdateSuccess(true);
      setUser(updatedUser);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Profile
      </h1>

      {/* Thông báo nếu tài khoản chưa được kích hoạt */}
      {!user.isActive && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg flex items-center gap-2">
          <FaExclamationCircle className="text-xl" />
          <span>
            Your account is not active. Please contact support for activation.
          </span>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.imageURL || "https://via.placeholder.com/150"}
            alt="profile"
            className="rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-white shadow-md"
          />
          <p className="text-sm text-gray-500">Click to change avatar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Username
            </label>
            <input
              type="text"
              value={formData.username || ""}
              id="username"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              placeholder="Username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ""}
              id="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              id="phone"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              placeholder="Phone"
            />
          </div>

          {/* Upload Driving License */}
          {!user.isActive && (
            <div>
              <Label value="Upload Driving License" />
              <div className="mt-2 flex items-center">
                <input
                  type="file"
                  id="licenseFile"
                  accept="image/*"
                  onChange={(e) => setLicenseFile(e.target.files[0])}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                />
              </div>
              {uploading && (
                <p className="text-blue-500 mt-2">Uploading image...</p>
              )}
              {formData.drivingLicense && !uploading && (
                <div className="mt-4">
                  <Label value="Current Driving License" />
                  <img
                    src={formData.drivingLicense}
                    alt="Driving License"
                    className="mt-2 w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              color="dark"
              type="submit"
              disabled={loading || !hasChanges}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>

          {/* Error & Success Message */}
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {updateSuccess && (
            <p className="text-green-600 mt-4">Profile updated successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
