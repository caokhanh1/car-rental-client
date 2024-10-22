import { useState, useEffect, useRef } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";
import useAxios from "../../utils/useAxios";
import Pagination from "../Pagination";
import EditCustomerModal from "./customer/EditCustomerModal";
import DeleteCustomerModal from "./customer/DeleteCustomerModal";
import ImageViewerModal from "./ImageViewerModal";

export default function DashCustomers() {
  const api = useAxios();
  const didFetchData = useRef(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, status } = await api.get("/users");
        if (status === 200) setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (!didFetchData.current) {
      fetchUsers();
      didFetchData.current = true;
    }
  }, [api]);

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle user status
  const handleToggleStatus = async (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);

    const userToUpdate = updatedUsers.find((user) => user.id === userId);

    try {
      await api.put(`/users/${userId}/active`, {
        isActive: userToUpdate.isActive,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Handle edit modal
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  // Handle delete modal
  const handleDelete = (id) => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
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
          <h2 className="text-2xl font-semibold leading-tight">Customers</h2>
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
                    Email
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Verify
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Driving License
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{user.id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{user.username}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{user.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{user.phone}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${
                          user.role === "Administrator"
                            ? "red"
                            : user.role === "Editor"
                            ? "blue"
                            : "green"
                        }-900 leading-tight`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 bg-${
                            user.role === "Administrator"
                              ? "red"
                              : user.role === "Editor"
                              ? "blue"
                              : "green"
                          }-200 opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.isActive}
                          onChange={() => handleToggleStatus(user.id)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span
                          className={`ml-3 text-sm font-medium ${
                            user.isActive ? "text-gray-900" : "text-gray-300"
                          } dark:text-gray-300`}
                        ></span>
                      </label>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${
                          user.isVerify ? "green" : "red"
                        }-900 leading-tight`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 bg-${
                            user.isVerify ? "green" : "red"
                          }-200 opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">
                          {user.isVerify ? "Verified" : "Not Verified"}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      {user.drivingLicense ? (
                        <button
                          onClick={() => handleViewImage(user.drivingLicense)}
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
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <HiPencil className="mr-1" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          pageSize={usersPerPage}
          totalEntries={filteredUsers.length}
        />

        <EditCustomerModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setUsers={setUsers}
        />

        <DeleteCustomerModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          userIdToDelete={userIdToDelete}
          setUsers={setUsers}
        />

        <ImageViewerModal
          show={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={selectedImage}
        />
      </div>
    </div>
  );
}
