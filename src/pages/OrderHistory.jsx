import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { toast } from "react-toastify";
import { FaCar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import axios from "axios";
import { Button, Label } from "flowbite-react";
import ModalReactModal from "react-modal";
import { Modal as ModalFlowbite } from "flowbite-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const OrderHistory = () => {
  const api = useAxios();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [conditionImagesOpen, setConditionImagesOpen] = useState(false);
  const [showModalUpdateOrder, setShowModalUpdateOrder] = useState(false);
  const [uploading, setUploading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();

  // Status Labels
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (initialLoad) setLoading(true);
      try {
        const { data, status } = await api.get(
          `/users/orders${filter !== "all" ? `?status=${filter}` : ""}`
        );
        if (status === 200) {
          setOrders(data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchOrders();
  }, [filter]);

  // Pagination Logic
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const maxPageButtons = 5;
  const [currentPageGroup, setCurrentPageGroup] = useState(0);

  const startPage = currentPageGroup * maxPageButtons;
  const endPage = startPage + maxPageButtons;
  const currentButtons = pageNumbers.slice(startPage, endPage);

  const nextPageGroup = () => {
    if (endPage < totalPages) {
      setCurrentPageGroup(currentPageGroup + 1);
    }
  };

  const prevPageGroup = () => {
    if (startPage > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalIsOpen(false);
  };

  const openConditionImages = () => {
    setConditionImagesOpen(true);
  };

  const closeConditionImages = () => {
    setConditionImagesOpen(false);
  };

  const withdrawOrder = async (orderId) => {
    try {
      const { status } = await api.put(`/users/orders/${orderId}/cancel`);
      if (status === 200) {
        toast.success("Order cancelled successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
        closeModal();
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      const { data, status } = await api.put(
        `/users/orders/${orderId}/confirm`
      );
      if (status === 200) {
        navigate("/payment", {
          state: { checkoutUrl: data.checkoutURL, orderId },
        });
      }
    } catch (error) {
      toast.error("Failed to confirm order");
    }
  };

  const confirmReturnOrder = async (orderId) => {
    try {
      const { data, status } = await api.put(`/users/orders/${orderId}/pay`);
      if (status === 200) {
        navigate("/payment", {
          state: { checkoutUrl: data.checkoutURL, orderId },
        });
      }
    } catch (error) {
      toast.error("Failed to confirm return order");
    }
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

  const handleCloseModalUpdateOrder = () => {
    setShowModalUpdateOrder(false);
  };

  const handleOpenModalUpdateOrder = (order) => {
    console.log(order);
    setSelectedOrder(order);
    setShowModalUpdateOrder(true);
  };

  const handleUpdateOrder = async () => {
    try {
      const { status } = await api.put(
        `/users/orders/${selectedOrder.id}/return`,
        {
          images: selectedOrder.images,
        }
      );

      if (status === 200) {
        setOrders((prevRequests) =>
          prevRequests.map((request) =>
            request.id === selectedOrder.id
              ? { ...request, status: "PendingReturn" }
              : request
          )
        );

        handleCloseModalUpdateOrder();
        toast.success("Return car successfully!");
      }
    } catch (error) {
      toast.error("Failed to update the order.");
    }
  };

  if (initialLoad) return <div>Loading...</div>;

  return (
    <div className="p-8 mx-28 bg-white">
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Order History
        </h2>

        {/* Bộ lọc trạng thái */}
        <div className="flex justify-center space-x-4 mb-6">
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } transition`}
              onClick={() => setFilter(status)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              {/* Header */}
              <thead>
                <tr className="bg-gray-100">
                  {[
                    "Image",
                    "Name",
                    "Rental Start",
                    "Rental End",
                    "Total Cost",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-center text-sm font-bold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    {/* Image */}
                    <td className="px-6 py-4 text-center">
                      <img
                        src={
                          order?.carOrder[0]?.car?.imageURL ||
                          "https://via.placeholder.com/150"
                        }
                        alt={order.carOrder[0]?.car?.name || "Unknown Car"}
                        className="w-16 h-16 rounded-lg object-cover shadow"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                      {order.carOrder[0]?.car?.name || "Unknown Car"}
                    </td>

                    {/* Rental Start */}
                    <td className="px-6 py-4 text-center text-gray-600">
                      {new Date(order.carOrder[0]?.startDate).toLocaleString()}
                    </td>

                    {/* Rental End */}
                    <td className="px-6 py-4 text-center text-gray-600">
                      {new Date(order.carOrder[0]?.endDate).toLocaleString()}
                    </td>

                    {/* Total Cost */}
                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                      {order.cost} VND
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "PendingReturn"
                            ? "bg-red-100 text-red-700"
                            : order.status === "OrderSuccess"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Returning"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabels[order.status] || "Unknown"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {/* View Button */}
                        <button
                          className="bg-gray-100 text-gray-600 p-2 rounded-full shadow hover:bg-gray-200 transition"
                          onClick={() => openModal(order)}
                        >
                          <FiEye size={16} />
                        </button>

                        {/* Return Button */}
                        {order.status === "OrderSuccess" && (
                          <button
                            onClick={() => handleOpenModalUpdateOrder(order)}
                            className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 transition"
                            title="Return Car"
                          >
                            <MdOutlineKeyboardReturn size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {startPage > 0 && (
          <button
            onClick={prevPageGroup}
            className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-700"
          >
            &laquo;
          </button>
        )}
        {currentButtons.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === pageNumber
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={nextPageGroup}
            className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-700"
          >
            &raquo;
          </button>
        )}
      </div>

      {/* Modal for Order Details */}
      <ModalReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Order Details"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full p-8 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {selectedOrder && (
            <div className="space-y-8 bg-gray-50 p-6 rounded-lg shadow-lg">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 text-center border-b pb-4">
                Order Summary
              </h2>

              {/* Order Details */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      selectedOrder.carOrder[0]?.car?.imageURL ||
                      "https://via.placeholder.com/150"
                    }
                    alt={selectedOrder.carOrder[0]?.car?.name || "Unknown Car"}
                    className="w-20 h-20 rounded-lg object-cover shadow"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedOrder.carOrder[0]?.car?.name || "Unknown Car"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`${
                          selectedOrder.status === "New"
                            ? "text-blue-500"
                            : selectedOrder.status === "PendingConfirm"
                            ? "text-yellow-500"
                            : "text-green-500"
                        } font-semibold`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>
                {selectedOrder.status !== "New" && (
                  <button
                    className="bg-gray-100 text-gray-600 p-3 rounded-full shadow hover:bg-gray-200 hover:scale-105 transition-transform"
                    onClick={openConditionImages}
                  >
                    <FaCar className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Rental Details */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rental start:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(
                      selectedOrder.carOrder[0]?.startDate
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rental end:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(
                      selectedOrder.carOrder[0]?.endDate
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.cost} VND
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-xl font-bold text-gray-800">
                    {selectedOrder.cost} VND
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-500">Deposit Amount:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.deposit} VND
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                {selectedOrder.status === "New" && (
                  <button
                    onClick={() => withdrawOrder(selectedOrder.id)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Withdraw Order
                  </button>
                )}

                {selectedOrder.status === "PendingConfirm" && (
                  <>
                    <button
                      onClick={() => withdrawOrder(selectedOrder.id)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Withdraw Order
                    </button>
                    <button
                      onClick={() => confirmOrder(selectedOrder.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Confirm Order
                    </button>
                  </>
                )}

                {selectedOrder.status === "Returning" && (
                  <button
                    onClick={() => confirmReturnOrder(selectedOrder.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Confirm Return
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </ModalReactModal>

      {/* Modal for Car Condition Images */}
      <ModalReactModal
        isOpen={conditionImagesOpen}
        onRequestClose={closeConditionImages}
        contentLabel="Car Condition"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-full max-w-4xl p-6 relative overflow-y-auto rounded-lg shadow-lg">
          {/* Close Button */}
          <button
            onClick={closeConditionImages}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
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

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Vehicle Condition
          </h2>
          <p className="text-sm text-gray-600 text-center mb-4">
            Inspect the car’s condition through the images below.
          </p>

          {/* Swiper Carousel */}
          {selectedOrder && selectedOrder.image?.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={1}
              className="w-full h-[400px] rounded-lg"
            >
              {selectedOrder.image
                ?.filter((img) => img.type === "Confirm")
                .map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="flex justify-center items-center"
                  >
                    <img
                      src={img.imageURL}
                      alt={`Condition ${index + 1}`}
                      className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          ) : (
            <p className="text-gray-500 text-center">No images available</p>
          )}
        </div>
      </ModalReactModal>

      {showModalUpdateOrder && (
        <ModalFlowbite
          show={showModalUpdateOrder}
          onClose={handleCloseModalUpdateOrder}
        >
          <ModalFlowbite.Header>Return order</ModalFlowbite.Header>
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
    </div>
  );
};

export default OrderHistory;
