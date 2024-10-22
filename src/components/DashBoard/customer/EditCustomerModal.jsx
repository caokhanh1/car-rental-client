import { Modal, Button, Label, TextInput } from "flowbite-react";
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";

const EditCustomerModal = ({
  show,
  onClose,
  currentUser,
  setCurrentUser,
  setUsers,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
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
      setCurrentUser({ ...currentUser, drivingLicense: imageUrl });
    } catch (error) {
      console.error("Error uploading the image:", error);
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/users/${currentUser.id}`, currentUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentUser.id ? currentUser : user
        )
      );
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Edit Customer</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              value={currentUser?.username || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, username: e.target.value })
              }
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput
              id="phone"
              type="text"
              value={currentUser?.phone || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, phone: e.target.value })
              }
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              value={currentUser?.email || ""}
              disabled
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label htmlFor="role" value="Role" />
            <TextInput
              id="role"
              type="text"
              value={currentUser?.role || ""}
              disabled
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label value="Upload Driver's License" />
            <div className="mt-2 flex items-center">
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
              />
            </div>
            {uploading && (
              <p className="text-blue-500 mt-2">Uploading image...</p>
            )}
            {/* Hiển thị ảnh bằng lái xe hiện tại nếu có */}
            {currentUser?.drivingLicense && !uploading && (
              <div className="mt-4">
                <Label value="Current Driver's License" />
                <img
                  src={currentUser.drivingLicense}
                  alt="Driver's License"
                  className="mt-2 w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSaveEdit} color="dark">
          Save Changes
        </Button>
        <Button onClick={onClose} color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EditCustomerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  setCurrentUser: PropTypes.func.isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default EditCustomerModal;
