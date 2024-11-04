import axios from "axios";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import PropTypes from "prop-types";
import { useState } from "react";

const EditVehicleModal = ({
  show,
  onClose,
  currentVehicle,
  setCurrentVehicle,
  vehicleTypeOptions,
  handleInputChange,
  handleUpdateVehicle,
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
      setCurrentVehicle({ ...currentVehicle, imageURL: imageUrl });
    } catch (error) {
      console.error("Error uploading the image:", error);
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Edit Vehicle</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              value={currentVehicle.name}
              onChange={(e) => handleInputChange(e, setCurrentVehicle, "name")}
            />
          </div>
          <div>
            <Label htmlFor="licensePlate" value="License Plate" />
            <TextInput
              id="licensePlate"
              type="text"
              value={currentVehicle.licensePlate}
              onChange={(e) =>
                handleInputChange(e, setCurrentVehicle, "licensePlate")
              }
            />
          </div>
          <div>
            <Label htmlFor="fuel" value="Fuel" />
            <TextInput
              id="fuel"
              type="text"
              value={currentVehicle.fuel}
              onChange={(e) => handleInputChange(e, setCurrentVehicle, "fuel")}
            />
          </div>
          <div>
            <Label htmlFor="pricePerHour" value="Price/Hour" />
            <TextInput
              id="pricePerHour"
              type="number"
              value={currentVehicle.pricePerHour}
              onChange={(e) =>
                handleInputChange(e, setCurrentVehicle, "pricePerHour")
              }
            />
          </div>
          <div>
            <Label htmlFor="pricePerDay" value="Price/Day" />
            <TextInput
              id="pricePerDay"
              type="number"
              value={currentVehicle.pricePerDay}
              onChange={(e) =>
                handleInputChange(e, setCurrentVehicle, "pricePerDay")
              }
            />
          </div>
          <div>
            <Label htmlFor="carTypeID" value="Car Type" />
            <select
              id="carTypeID"
              value={currentVehicle.carTypeID}
              onChange={(e) =>
                handleInputChange(e, setCurrentVehicle, "carTypeID")
              }
              className="mt-1 w-full border rounded-md"
            >
              <option value="">Select Car Type</option>
              {vehicleTypeOptions.map((vehicleType) => (
                <option key={vehicleType.id} value={vehicleType.id}>
                  {vehicleType.type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label value="Upload Vehicle Image" />
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
            {/* Hiển thị ảnh cũ nếu có */}
            {currentVehicle.imageURL && !uploading && (
              <div className="mt-4">
                <Label value="Current Vehicle Image" />
                <img
                  src={currentVehicle.imageURL}
                  alt="Vehicle"
                  className="mt-2 w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdateVehicle} color="dark">
          Save Changes
        </Button>
        <Button onClick={onClose} color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EditVehicleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentVehicle: PropTypes.shape({
    name: PropTypes.string,
    licensePlate: PropTypes.string,
    pricePerHour: PropTypes.number,
    pricePerDay: PropTypes.number,
    carTypeID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imageURL: PropTypes.string,
    fuel: PropTypes.string,
  }).isRequired,
  setCurrentVehicle: PropTypes.func.isRequired,
  vehicleTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleUpdateVehicle: PropTypes.func.isRequired,
};

export default EditVehicleModal;
