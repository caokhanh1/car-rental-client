import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Label, TextInput } from "flowbite-react";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        fileFormData
      );
      const imageUrl = res.data.secure_url;
      setFormData((prev) => ({
        ...prev,
        drivingLicense: imageUrl,
      }));
      setImageUploaded(true);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUploaded) {
      setError("Please upload your driver's license before signing up.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auths/sign-up`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/sign-in", {
        state: {
          startPath: "register",
        },
      });
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto mb-100">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label value="Your email" />
          <TextInput
            type="email"
            placeholder="name@gmail.com"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label value="Your password" />
          <TextInput
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label value="Username" />
          <TextInput
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label value="Phone" />
          <TextInput
            type="tel"
            placeholder="Phone"
            id="phone"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label value="Upload Driver's License" />
          <input
            type="file"
            id="drivingLicense"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
          />
        </div>

        {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
