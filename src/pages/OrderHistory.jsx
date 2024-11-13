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
              ? { ...request, status: "pendingReturn" }
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
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      <div className="flex justify-center space-x-6 mb-4 text-gray-600">
        {Object.entries(statusLabels).map(([status, label]) => (
          <button
            key={status}
            className={`${
              filter === status ? "text-indigo-600 font-semibold" : ""
            }`}
            onClick={() => setFilter(status)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Image
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Name
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Rental Start
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Rental End
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Total Cost
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Status
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <img
                      src={
                        order?.carOrder[0]?.car?.imageURL ||
                        "https://via.placeholder.com/150"
                      }
                      alt={order.carOrder[0]?.car?.name || "Unknown Car"}
                      className="w-16 h-16 rounded object-cover mx-auto"
                    />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    {order.carOrder[0]?.car?.name || "Unknown Car"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    {new Date(order.carOrder[0]?.startDate).toLocaleString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    {new Date(order.carOrder[0]?.endDate).toLocaleString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    {order.cost} VND
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "PendingApproval"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "OrderSuccess"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Returning"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "ReturnSuccess"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "New"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {statusLabels[order.status] || "Unknown"}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-[#334155] text-white p-4 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
                        onClick={() => openModal(order)}
                      >
                        <FiEye size={12} />
                      </button>

                      {order.status === "OrderSuccess" && (
                        <button
                          onClick={() => handleOpenModalUpdateOrder(order)}
                          className="bg-[#334155] text-white p-3 rounded-full hover:bg-gray-800 transition-transform duration-300 transform hover:scale-105 flex items-center justify-center"
                          title="Return Car"
                        >
                          <MdOutlineKeyboardReturn className="w-5 h-5" />
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
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Order Summary
              </h2>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      selectedOrder.carOrder[0]?.car?.imageURL ||
                      "https://via.placeholder.com/150"
                    }
                    alt={selectedOrder.carOrder[0]?.car?.name || "Unknown Car"}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {selectedOrder.carOrder[0]?.car?.name || "Unknown Car"}
                    </h3>
                  </div>
                  {selectedOrder.status !== "New" && (
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-[#334155] text-white p-2 rounded-full shadow-sm flex items-center justify-center transition-transform duration-300 hover:scale-105"
                        onClick={openConditionImages}
                      >
                        <FaCar className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
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
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-xl font-bold text-gray-800">
                    {selectedOrder.cost} VND
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-gray-500">Deposit Amount:</span>
                <span className="font-semibold text-gray-800">
                  {selectedOrder.deposit} VND
                </span>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {selectedOrder.status === "New" && (
                  <button
                    onClick={() => withdrawOrder(selectedOrder.id)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Withdraw Order
                  </button>
                )}

                {selectedOrder.status === "PendingConfirm" && (
                  <>
                    <button
                      onClick={() => withdrawOrder(selectedOrder.id)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Withdraw Order
                    </button>
                    <button
                      onClick={() => confirmOrder(selectedOrder.id)}
                      className="bg-[#334155] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Confirm Order
                    </button>
                  </>
                )}

                {selectedOrder.status === "Returning" && (
                  <button
                    onClick={() => confirmReturnOrder(selectedOrder.id)}
                    className="bg-[#334155] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
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
              selectedOrder.images?.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Condition ${index + 1}`}
                  className="w-full h-60 object-cover rounded-lg"
                />
              ))}
          </div>
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
