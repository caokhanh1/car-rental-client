import { useEffect, useRef, useState, useCallback } from "react";
import {
  HiPencil,
  HiPlus,
  HiTrash,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import useAxios from "../../utils/useAxios";
import { toast } from "react-toastify";
import Pagination from "../Pagination";

import CreateVehicleModal from "./vehicle/CreateVehicleModal";
import EditVehicleModal from "./vehicle/EditVehicleModal";
import DeleteVehicleModal from "./vehicle/DeleteVehicleModal";
import ImageViewerModal from "./ImageViewerModal";

const DashVehicle = () => {
  const api = useAxios();
  const didFetchData = useRef(false);

  const [vehicleTypes, setVehicleTypesData] = useState([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newVehicle, setNewVehicle] = useState(initVehicle());
  const [currentVehicle, setCurrentVehicle] = useState(initVehicle());
  const [vehicleIdToDelete, setVehicleIdToDelete] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const limit = 5;

  // Helper function to initialize vehicle state
  function initVehicle() {
    return {
      id: "",
      name: "",
      licensePlate: "",
      pricePerHour: 0,
      pricePerDay: 0,
      imageURL: "",
      carTypeID: "",
    };
  }

  const handleInputChange = (e, setState, field) => {
    const { value } = e.target;
    setState((prev) => ({
      ...prev,
      [field]: field.includes("price") ? parseFloat(value) : value,
    }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetching data functions
  const fetchVehicles = useCallback(async () => {
    try {
      const { data, status } = await api.get("/cars");
      if (status === 200) setVehicleTypesData(data);
    } catch {
      toast.error("Error fetching vehicles");
    }
  }, [api]);

  const fetchVehicleTypes = useCallback(async () => {
    try {
      const { data, status } = await api.get("/car-types");
      if (status === 200) setVehicleTypeOptions(data);
    } catch {
      toast.error("Error fetching vehicle types");
    }
  }, [api]);

  useEffect(() => {
    if (!didFetchData.current) {
      fetchVehicles();
      fetchVehicleTypes();
      didFetchData.current = true;
    }
  }, [fetchVehicles, fetchVehicleTypes]);

  const filteredVehicles = vehicleTypes.filter((vehicle) => {
    const matchesSearch = vehicle.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType
      ? vehicle.carTypeID.toString() === filterType
      : true;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredVehicles.length / limit);

  const currentVehicles = filteredVehicles.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleCreateVehicle = async () => {
    try {
      const { status } = await api.post("/cars", newVehicle);
      if (status === 200) {
        toast.success("Vehicle created successfully");
        setShowCreateModal(false);
        setNewVehicle(initVehicle());
        fetchVehicles();
      }
    } catch {
      toast.error("Error creating vehicle");
    }
  };

  const handleEditVehicle = (vehicle) => {
    setCurrentVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      const { status } = await api.put(
        `/cars/${currentVehicle.id}`,
        currentVehicle
      );
      if (status === 200) {
        toast.success("Vehicle updated successfully");
        setShowEditModal(false);
        fetchVehicles();
      }
    } catch {
      toast.error("Error updating vehicle");
    }
  };

  const handleDeleteVehicle = (id) => {
    setVehicleIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/cars/${vehicleIdToDelete}`);
      toast.success("Vehicle deleted successfully");
      setShowDeleteModal(false);
      fetchVehicles();
    } catch {
      toast.error("Error deleting vehicle");
    }
  };

  // Handle image view modal
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">
            Vehicle Manage
          </h2>

          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Types</option>
              {vehicleTypeOptions.map((vehicleType) => (
                <option key={vehicleType.id} value={vehicleType.id}>
                  {vehicleType.type}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-600 text-white p-3 rounded-full flex items-center justify-center"
            >
              <HiPlus className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    License Plate
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    In Use
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Price/Hour
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Price/Day
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Image
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicle.id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicle.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicle.carType.type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicle.licensePlate}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      {vehicle.isInUse ? (
                        <HiCheckCircle className="text-green-500 text-xl mx-auto" />
                      ) : (
                        <HiXCircle className="text-gray-400 text-xl mx-auto" />
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">
                        {vehicle.pricePerHour} VND
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicle.pricePerDay} VND</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      {vehicle.imageURL ? (
                        <button
                          onClick={() => handleViewImage(vehicle.imageURL)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                      ) : (
                        <p className="text-gray-500">No Image</p>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <HiPencil className="mr-1" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <HiTrash className="mr-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            pageSize={limit}
            totalEntries={filteredVehicles.length}
          />

          <CreateVehicleModal
            show={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            newVehicle={newVehicle}
            setNewVehicle={setNewVehicle}
            vehicleTypeOptions={vehicleTypeOptions}
            handleInputChange={handleInputChange}
            handleCreateVehicle={handleCreateVehicle}
          />

          <EditVehicleModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            currentVehicle={currentVehicle}
            setCurrentVehicle={setCurrentVehicle}
            vehicleTypeOptions={vehicleTypeOptions}
            handleInputChange={handleInputChange}
            handleUpdateVehicle={handleUpdateVehicle}
          />

          <DeleteVehicleModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            confirmDelete={confirmDelete}
          />

          <ImageViewerModal
            show={showImageModal}
            onClose={() => setShowImageModal(false)}
            imageUrl={selectedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default DashVehicle;
