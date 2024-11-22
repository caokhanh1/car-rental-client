/* eslint-disable react/no-unescaped-entities */
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ImageViewerModal from "./ImageViewerModal";

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
  const [contactImage, setContactImage] = useState(null);
  const [contactUploading, setContactUploading] = useState(false);
  const [showConfirmReturnModal, setShowConfirmReturnModal] = useState(false);
  const [punishmentAmount, setPunishmentAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const statusLabels = {
    all: "All",
    New: "New",
    PendingConfirm: "Pending",
    OrderSuccess: "Order",
    PendingReturn: "Pending Return",
    Returning: "Returning",
    Success: "Completed",
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

  const handleOpenConfirmReturnModal = (orderId) => {
    setCurrentOrderId(orderId);
    setPunishmentAmount(0);
    setReason("");
    setShowConfirmReturnModal(true);
  };

  const handleCloseConfirmReturnModal = () => {
    setShowConfirmReturnModal(false);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleUpdateOrder = async () => {
    try {
      const { status } = await api.put(`/admins/orders/${selectedOrder.id}`, {
        images: selectedOrder.images,
        contract: contactImage,
      });
      handleCloseModalUpdateOrder();
      if (status === 200) {
        setRentalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === selectedOrder.id
              ? { ...request, status: "PendingConfirm" }
              : request
          )
        );
        toast.success("Order updated successfully!");
      }
    } catch (error) {
      handleCloseModalUpdateOrder();
      toast.error("Failed to update the order.");
    }
  };

  const confirmReturnWithDetails = async () => {
    try {
      const { status } = await api.put(
        `/admins/orders/${currentOrderId}/confirm-return`,
        {
          punishmentAmount,
          reason,
        }
      );
      handleCloseConfirmReturnModal();
      if (status === 200) {
        toast.success("Return confirmed successfully!");
        setRentalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === currentOrderId
              ? { ...request, status: "Returning" }
              : request
          )
        );
      }
    } catch (error) {
      handleCloseConfirmReturnModal();
      toast.error("Failed to confirm return.");
    }
  };

  const handleContactImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setContactUploading(true);

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
      setContactImage(imageUrl);
    } catch (error) {
      console.error("Error uploading the contact image:", error);
      toast.error("Failed to upload the contact image.");
    } finally {
      setContactUploading(false);
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
              <option value="Success">Completed</option>
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
                    Contract
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
                              : request.status === "Success"
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
                        {request.contract ? (
                          <button
                            onClick={() => handleViewImage(request.contract)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                        ) : (
                          <p className="text-gray-500">No Image</p>
                        )}
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
                              onClick={() =>
                                handleOpenConfirmReturnModal(request.id)
                              }
                            />
                          )}
                          <HiXCircle
                            className="w-6 h-6 text-red-500 cursor-pointer hover:opacity-80"
                            onClick={() => console.log("Reject", request.id)}
                          />
                          {(request.status === "PendingReturn" ||
                            request.status === "Returning" ||
                            request.status === "Returning") && (
                            <HiEye
                              className="w-6 h-6 text-blue-500 cursor-pointer hover:opacity-80"
                              onClick={() => {
                                openConditionImages(request);
                              }}
                            />
                          )}
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

      {showConfirmReturnModal && (
        <ModalFlowbite
          show={showConfirmReturnModal}
          onClose={handleCloseConfirmReturnModal}
        >
          <ModalFlowbite.Header>Confirm Return</ModalFlowbite.Header>
          <ModalFlowbite.Body>
            <div className="space-y-4">
              <div>
                <Label value="Punishment Amount" />
                <TextInput
                  type="number"
                  value={punishmentAmount}
                  onChange={(e) => setPunishmentAmount(Number(e.target.value))}
                  placeholder="Enter punishment amount"
                  className="mt-2"
                />
              </div>
              <div>
                <Label value="Reason" />
                <TextInput
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason"
                  className="mt-2"
                />
              </div>
            </div>
          </ModalFlowbite.Body>
          <ModalFlowbite.Footer>
            <Button onClick={confirmReturnWithDetails} color="dark">
              Confirm
            </Button>
            <Button onClick={handleCloseConfirmReturnModal} color="gray">
              Cancel
            </Button>
          </ModalFlowbite.Footer>
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
              <div>
                <Label value="Upload Contact Image" />
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    id="contactFile"
                    accept="image/*"
                    onChange={handleContactImageUpload}
                    className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
                  />
                </div>
                {contactUploading && (
                  <p className="text-green-500 mt-2">
                    Uploading contact image...
                  </p>
                )}
                {contactImage && (
                  <div className="mt-4">
                    <img
                      src={contactImage}
                      alt="Contact"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
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
        <div
          className="relative w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-hidden"
          style={{
            background: "linear-gradient(to bottom, #f8fafc, #e8eff3)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeConditionImages}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
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

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Vehicle Condition Report
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Review the images below for a detailed inspection.
          </p>

          {/* Swiper Carousel */}
          <div className="flex justify-center items-center">
            {selectedOrder && selectedOrder.image?.length > 0 ? (
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1}
                className="w-full h-[400px] rounded-lg shadow-md"
              >
                {selectedOrder.image
                  ?.filter((img) => img.type === "Return")
                  .map((img, index) => (
                    <SwiperSlide
                      key={index}
                      className="flex justify-center items-center bg-white rounded-lg shadow"
                    >
                      <img
                        src={img.imageURL}
                        alt={`Condition ${index + 1}`}
                        className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            ) : (
              <p className="text-gray-500 text-center">No images available</p>
            )}
          </div>
        </div>
      </ModalReactModal>

      <ImageViewerModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default DashRentalRequest;
