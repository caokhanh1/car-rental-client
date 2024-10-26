import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Label, TextInput } from "flowbite-react";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto mb-100">
      <h1 className="text-3xl text-center font-semibold my-7">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label value="Email của bạn" />
          <TextInput
            type="email"
            placeholder="tenban@gmail.com"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label value="Mật khẩu của bạn" />
          <TextInput
            type="password"
            placeholder="Mật khẩu"
            id="password"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label value="Tên người dùng" />
          <TextInput
            type="text"
            placeholder="Tên người dùng"
            id="username"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label value="Số điện thoại" />
          <TextInput
            type="tel"
            placeholder="Số điện thoại"
            id="phone"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label value="Tải lên giấy phép lái xe" />
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

        {uploading && <p className="text-blue-500 mt-2">Đang tải hình ảnh...</p>}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Đang tải..." : "Đăng ký"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Đã có tài khoản?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Đăng nhập</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
