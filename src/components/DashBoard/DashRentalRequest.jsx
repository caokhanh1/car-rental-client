import { useState, useEffect } from "react";
import { HiPencil, HiTrash, HiUser } from "react-icons/hi";
import { toast } from "react-toastify";
import useAxios from "../../utils/useAxios";

import { FaCar } from "react-icons/fa";
import { Label, Modal, TextInput } from "flowbite-react";

const DashRentalRequest = () => {
  const api = useAxios();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalUser, setShowModalUser] = useState(false);
  const [showModalCar, setShowModalCar] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [currentCar, setCurrentCar] = useState({});

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
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : rentalRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
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
                        {request.status}
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
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => console.log("Edit", request.id)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <HiPencil className="mr-1" />
                          </button>
                          <button
                            onClick={() => console.log("Delete", request.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <HiTrash className="mr-1" />
                          </button>
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
        <Modal show={showModalUser} onClose={handleCloseModalUser}>
          <Modal.Header>User order information</Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
        </Modal>
      )}

      {showModalCar && (
        <Modal show={showModalCar} onClose={handleCloseModalCar}>
          <Modal.Header>Car order information</Modal.Header>
          <Modal.Body>
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
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashRentalRequest;