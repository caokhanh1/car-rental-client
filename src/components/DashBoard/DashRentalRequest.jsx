import { useState, useEffect } from "react";
import { HiUser } from "react-icons/hi";
import { toast } from "react-toastify";
import useAxios from "../../utils/useAxios";
import { HiCheckCircle, HiXCircle, HiEye } from "react-icons/hi";

import { FaCar } from "react-icons/fa";
import { Button, Label, TextInput } from "flowbite-react";
import ModalReactModal from "react-modal";
import { Modal as ModalFlowbite } from "flowbite-react";
import axios from "axios";

ModalReactModal.setAppElement("#root");

const DashRentalRequest = () => {
  const api = useAxios();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rentalRequests, setRentalRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalUser, setShowModalUser] = useState(false);
  const [showModalCar, setShowModalCar] = useState(false);
  const [showModalUpdateOrder, setShowModalUpdateOrder] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentCar, setCurrentCar] = useState({});
  const [uploading, setUploading] = useState(false);
  const [conditionImagesOpen, setConditionImagesOpen] = useState(false);
  const statusLabels = {
    all: "All",
    New: "New",
    PendingConfirm: "Pending",
    OrderSuccess: "Order",
    PendingReturn: "Pending Return",
    Returning: "Returning",
    ReturnSuccess: "Completed",
    Canceled: "Canceled",
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);

    const imageUrls = [];
    for (let file of files) {
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
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
        toast.error("Failed to upload one or more images.");
      }
    }

    setUploading(false);

    // Update the selectedOrder with the new images
    setSelectedOrder((prevOrder) => ({
      ...prevOrder,
      images: [...(prevOrder.images || []), ...imageUrls],
    }));
  };

  useEffect(() => {
    const fetchRentalRequests = async () => {
      setLoading(true);
      try {
        const { data, status } = await api.get(
          `/admins/orders${
            filterStatus !== "all" ? `?status=${filterStatus}` : ""
          }`
        );
        if (status === 200) {
          setRentalRequests(data);
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch rental requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRentalRequests();
  }, [filterStatus]);

  const handleOpenModalUser = (user) => {
    setCurrentUser(user);
    setShowModalUser(true);
  };

  const handleCloseModalUser = () => {
    setShowModalUser(false);
  };

  const handleOpenModalCar = (car) => {
    setCurrentCar(car);
    setShowModalCar(true);
  };

  const handleCloseModalCar = () => {
    setShowModalCar(false);
  };

  const handleOpenModalUpdateOrder = (order) => {
    setSelectedOrder(order);
    setShowModalUpdateOrder(true);
  };

  const handleCloseModalUpdateOrder = () => {
    setShowModalUpdateOrder(false);
  };

  const openConditionImages = (order) => {
    setSelectedOrder(order);
    setConditionImagesOpen(true);
  };

  const closeConditionImages = () => {
    setConditionImagesOpen(false);
  };

  const handleUpdateOrder = async () => {
    try {
      const { status } = await api.put(`/admins/orders/${selectedOrder.id}`, {
        images: selectedOrder.images,
      });

      if (status === 200) {
        setRentalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === selectedOrder.id
              ? { ...request, status: "PendingApproval" }
              : request
          )
        );

        handleCloseModalUpdateOrder();
        toast.success("Order updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update the order.");
    }
  };

  const confirmReturn = async (orderId) => {
    try {
      const { status } = await api.put(
        `/admins/orders/${orderId}/confirm-return`
      );
      if (status !== 200) {
        toast.success("Confirm return successfully");
        selectedOrder((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Returning" } : order
          )
        );
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">
            Rental Requests
          </h2>
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="New">New</option>
              <option value="PendingApproval">Pending</option>
              <option value="OrderSuccess">Order</option>
              <option value="PendingReturn">Pending Return</option>
              <option value="Returning">Returning</option>
              <option value="ReturnSuccess">Completed</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                    Car
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    End Date
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Cost
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Deposit
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    User
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : rentalRequests.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No rental requests found.
                    </td>
                  </tr>
                ) : (
                  rentalRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        {request.id}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <FaCar
                            className="w-6 h-6 text-gray-500 cursor-pointer"
                            onClick={() =>
                              handleOpenModalCar(request.carOrder[0].car)
                            }
                          />
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        {new Date(
                          request.carOrder[0].startDate
                        ).toLocaleString()}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        {new Date(request.carOrder[0].endDate).toLocaleString()}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            request.status === "PendingApproval"
                              ? "bg-orange-100 text-orange-700"
                              : request.status === "OrderSuccess"
                              ? "bg-green-100 text-green-700"
                              : request.status === "Returning"
                              ? "bg-yellow-100 text-yellow-700"
                              : request.status === "ReturnSuccess"
                              ? "bg-blue-100 text-blue-700"
                              : request.status === "New"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {statusLabels[request.status] || "Unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        {request.cost} (VND)
                        {request.isPay ? (
                          <span className="ml-2 text-green-500">✅</span>
                        ) : (
                          <span className="ml-2 text-red-500">❌</span>
                        )}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        {request.deposit} (VND)
                        {request.isDeposit ? (
                          <span className="ml-2 text-green-500">✅</span>
                        ) : (
                          <span className="ml-2 text-red-500">❌</span>
                        )}
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <HiUser
                            className="w-8 h-8 text-gray-500 cursor-pointer"
                            onClick={() => handleOpenModalUser(request.user)}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          {request.status === "New" && (
                            <HiCheckCircle
                              className="w-6 h-6 text-green-500 cursor-pointer hover:opacity-80"
                              onClick={() =>
                                handleOpenModalUpdateOrder(request)
                              }
                            />
                          )}
                          {request.status === "PendingReturn" && (
                            <HiCheckCircle
                              className="w-6 h-6 text-green-500 cursor-pointer hover:opacity-80"
                              onClick={() => confirmReturn(request.id)}
                            />
                          )}
                          <HiXCircle
                            className="w-6 h-6 text-red-500 cursor-pointer hover:opacity-80"
                            onClick={() => console.log("Reject", request.id)}
                          />
                          <HiEye
                            className="w-6 h-6 text-blue-500 cursor-pointer hover:opacity-80"
                            onClick={() => {
                              if (request.status === "PendingReturn") {
                                openConditionImages(request);
                              } else {
                                console.log("View", request.id);
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModalUser && (
        <ModalFlowbite show={showModalUser} onClose={handleCloseModalUser}>
          <ModalFlowbite.Header>User order information</ModalFlowbite.Header>
          <ModalFlowbite.Body>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  type="text"
                  value={currentUser.username || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="text"
                  value={currentUser.email || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput
                  id="phone"
                  type="text"
                  value={currentUser.phone || ""}
                  readOnly
                />
              </div>
            </div>
          </ModalFlowbite.Body>
        </ModalFlowbite>
      )}

      {showModalCar && (
        <ModalFlowbite show={showModalCar} onClose={handleCloseModalCar}>
          <ModalFlowbite.Header>Car order information</ModalFlowbite.Header>
          <ModalFlowbite.Body>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  type="text"
                  value={currentCar.name || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="licensePlate" value="License Plate" />
                <TextInput
                  id="licensePlate"
                  type="text"
                  value={currentCar.licensePlate || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="pricePerHour" value="Price Per Hour" />
                <TextInput
                  id="pricePerHour"
                  type="text"
                  value={`${currentCar.pricePerHour || ""} VND`}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="pricePerDay" value="Price Per Day" />
                <TextInput
                  id="pricePerDay"
                  type="text"
                  value={`${currentCar.pricePerDay || ""} VND`}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="fuel" value="Fuel" />
                <TextInput
                  id="fuel"
                  type="text"
                  value={currentCar.fuel || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="seats" value="Seats" />
                <TextInput
                  id="seats"
                  type="text"
                  value={currentCar.seats || ""}
                  readOnly
                />
              </div>
              <div className="mt-4">
                <Label value="Car Image" />
                <img
                  src={currentCar.imageURL}
                  alt="Vehicle"
                  className="mt-2 w-32 h-32 object-cover rounded-md border"
                />
              </div>
            </div>
          </ModalFlowbite.Body>
        </ModalFlowbite>
      )}

      {showModalUpdateOrder && (
        <ModalFlowbite
          show={showModalUpdateOrder}
          onClose={handleCloseModalUpdateOrder}
        >
          <ModalFlowbite.Header>Confirm order</ModalFlowbite.Header>
          <ModalFlowbite.Body>
            <div className="space-y-6">
              <div>
                <Label value="Upload Vehicle Images" />
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                  />
                </div>
                {uploading && (
                  <p className="text-blue-500 mt-2">Uploading images...</p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {selectedOrder?.images?.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Vehicle ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            </div>
          </ModalFlowbite.Body>
          <ModalFlowbite.Footer>
            <Button onClick={handleUpdateOrder} color="dark">
              Confirm
            </Button>
            <Button onClick={handleCloseModalUpdateOrder} color="gray">
              Cancel
            </Button>
          </ModalFlowbite.Footer>
        </ModalFlowbite>
      )}

      <ModalReactModal
        isOpen={conditionImagesOpen}
        onRequestClose={closeConditionImages}
        contentLabel="Car Condition Images"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-full h-full p-8 relative overflow-y-auto">
          <button
            onClick={closeConditionImages}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Car Condition Images
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {selectedOrder &&
              selectedOrder.image
                ?.filter((img) => img.type === "Return")
                .map((img, index) => (
                  <img
                    key={index}
                    src={img.imageURL}
                    alt={`Condition ${index + 1}`}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                ))}
          </div>
        </div>
      </ModalReactModal>
    </div>
  );
};

export default DashRentalRequest;
