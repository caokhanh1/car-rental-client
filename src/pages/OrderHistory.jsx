import { useEffect, useState } from "react";
import Modal from "react-modal";
import useAxios from "../utils/useAxios";
import { toast } from "react-toastify";
import { FaCar } from "react-icons/fa";

const OrderHistory = () => {
  const api = useAxios();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(2);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [conditionImagesOpen, setConditionImagesOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
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
      }
    };

    fetchOrders();
  }, [filter]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 mx-28 bg-white">
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      <div className="flex space-x-6 mb-4 text-gray-600">
        {[
          { status: "all", label: "All" },
          { status: "New", label: "New" },
          { status: "PendingApproval", label: "Pending" },
          { status: "OrderSuccess", label: "Order" },
          { status: "Returning", label: "Returning" },
          { status: "ReturnSuccess", label: "Completed" },
        ].map(({ status, label }) => (
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
      <div className="space-y-6">
        <div className="grid grid-cols-7 gap-4 text-gray-700 font-semibold mb-2">
          <span>Image</span>
          <span>Name</span>
          <span>Rental Start</span>
          <span>Rental End</span>
          <span>Total Cost</span>
          <span>Status</span>
          <span></span>
        </div>

        {currentOrders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-7 gap-4 items-center border-b border-gray-200 py-4"
          >
            <img
              src={
                order?.carOrder[0]?.car?.imageURL ||
                "https://via.placeholder.com/150"
              }
              alt={order.carOrder[0].car.name}
              className="w-16 h-16 rounded object-cover"
            />
            <span>{order.carOrder[0].car.name || "Unknown Car"}</span>
            <span>
              {new Date(order.carOrder[0].startDate).toLocaleString()}
            </span>
            <span>{new Date(order.carOrder[0].endDate).toLocaleString()}</span>
            <span>{order.cost} VND</span>
            <span className="font-semibold">{order.status}</span>
            <div className="text-right">
              <button
                className="bg-[#334155] text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                onClick={() => openModal(order)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
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
      <Modal
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

          <div className="space-y-8">
            {selectedOrder && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        selectedOrder.carOrder[0].car.imageURL ||
                        "https://via.placeholder.com/150"
                      }
                      alt={selectedOrder.carOrder[0].car.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {selectedOrder.carOrder[0].car.name || "Unknown Car"}
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
                        selectedOrder.carOrder[0].startDate
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rental end:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(
                        selectedOrder.carOrder[0].endDate
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
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit Amount:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.deposit} VND
                  </span>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  {/* Conditional rendering based on status */}
                  {selectedOrder.status === "New" && (
                    <button
                      onClick={closeModal}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Withdraw Order
                    </button>
                  )}

                  {selectedOrder.status === "PendingApproval" && (
                    <>
                      <button
                        onClick={closeModal}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Withdraw Order
                      </button>
                      <button className="bg-[#334155] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Confirm Order
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "OrderSuccess" && (
                    <button className="bg-[#334155] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      Return Car
                    </button>
                  )}

                  {selectedOrder.status === "Returning" && (
                    <button className="bg-[#334155] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      Confirm Return
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
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
      </Modal>
    </div>
  );
};

export default OrderHistory;
