import axios from "axios";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import PropTypes from "prop-types";
import { useState } from "react";

const CreateVehicleModal = ({
  show,
  onClose,
  newVehicle,
  setNewVehicle,
  vehicleTypeOptions,
  handleInputChange,
  handleCreateVehicle,
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
      setNewVehicle({ ...newVehicle, imageURL: imageUrl });
    } catch (error) {
      console.error("Error uploading the image:", error);
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Create Vehicle</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              value={newVehicle.name}
              onChange={(e) => handleInputChange(e, setNewVehicle, "name")}
            />
          </div>
          <div>
            <Label htmlFor="licensePlate" value="License Plate" />
            <TextInput
              id="licensePlate"
              type="text"
              value={newVehicle.licensePlate}
              onChange={(e) =>
                handleInputChange(e, setNewVehicle, "licensePlate")
              }
            />
          </div>
          <div>
            <Label htmlFor="fuel" value="Fuel" />
            <TextInput
              id="fuel"
              type="text"
              value={newVehicle.fuel}
              onChange={(e) => handleInputChange(e, setNewVehicle, "fuel")}
            />
          </div>
          <div>
            <Label htmlFor="pricePerHour" value="Price/Hour" />
            <TextInput
              id="pricePerHour"
              type="number"
              value={newVehicle.pricePerHour}
              onChange={(e) =>
                handleInputChange(e, setNewVehicle, "pricePerHour")
              }
            />
          </div>
          <div>
            <Label htmlFor="pricePerDay" value="Price/Day" />
            <TextInput
              id="pricePerDay"
              type="number"
              value={newVehicle.pricePerDay}
              onChange={(e) =>
                handleInputChange(e, setNewVehicle, "pricePerDay")
              }
            />
          </div>
          <div>
            <Label htmlFor="carTypeID" value="Car Type" />
            <select
              id="carTypeID"
              value={newVehicle.carTypeID}
              onChange={(e) => handleInputChange(e, setNewVehicle, "carTypeID")}
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
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateVehicle} color="dark">
          Create Vehicle
        </Button>
        <Button onClick={onClose} color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CreateVehicleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newVehicle: PropTypes.shape({
    name: PropTypes.string,
    licensePlate: PropTypes.string,
    pricePerHour: PropTypes.number,
    pricePerDay: PropTypes.number,
    carTypeID: PropTypes.string,
    fuel: PropTypes.string,
  }).isRequired,
  setNewVehicle: PropTypes.func.isRequired,
  vehicleTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleCreateVehicle: PropTypes.func.isRequired,
};

export default CreateVehicleModal;
