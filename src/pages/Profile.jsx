import { useRef, useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { Button, Label } from "flowbite-react";
import { FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  let api = useAxios();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [licenseFile, setLicenseFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/me");
        setUser(data);
        setFormData(data);
        setUserLoaded(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Không thể tải thông tin người dùng");
        setUserLoaded(true);
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

      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: imageUrl,
      }));
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh:", error);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/me", formData);

      if (res.status === 200) {
        toast.success("Cập nhật thông tin thành công");
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Hồ Sơ
      </h1>

      {userLoaded && !user.isActive && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg flex items-center gap-2">
          <FaExclamationCircle className="text-xl" />
          <span>
            Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ hỗ trợ để kích hoạt.
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
          <p className="text-sm text-gray-500">Nhấn để thay đổi ảnh đại diện</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Tên người dùng
            </label>
            <input
              type="text"
              value={formData.username || ""}
              id="username"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              placeholder="Tên người dùng"
            />
          </div>

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

          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              id="phone"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
          </div>

          {!formData.drivingLicense && (
            <div>
              <Label value="Tải lên Giấy phép lái xe" />
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
                <p className="text-blue-500 mt-2">Đang tải lên hình ảnh...</p>
              )}
            </div>
          )}

          {formData.drivingLicense && !uploading && (
            <div className="mt-4">
              <Label value="Giấy phép lái xe hiện tại" />
              <img
                src={formData.drivingLicense}
                alt="Giấy phép lái xe"
                className="mt-2 w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              color="dark"
              type="submit"
              disabled={loading || !hasChanges}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
