import { useState, useEffect, useRef } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { HiOutlineExclamationCircle, HiPencil, HiTrash } from "react-icons/hi";
import useAxios from "../../utils/useAxios";
import axios from "axios";
import Pagination from "../Pagination";

export default function DashCustomers() {
  let api = useAxios();
  const didFetchData = useRef(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, status } = await api.get("/users");
        if (status === 200) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (!didFetchData.current) {
      fetchUsers();
      didFetchData.current = true;
    }
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toString().includes(searchTerm.toLowerCase())
  );

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleToggleStatus = async (userId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    });

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

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

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
      setCurrentUser({ ...currentUser, drivingLicense: imageUrl });
    } catch (error) {
      console.error("Error uploading the image:", error);
      setUploading(false);
    }
  };

  const handleSaveEdit = () => {
    api
      .put(`/users/${currentUser.id}`, currentUser)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === currentUser.id ? currentUser : user
          )
        );
        setShowEditModal(false);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const handleDelete = (id) => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    api
      .delete(`/users/${userIdToDelete}`)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userIdToDelete)
        );
        setShowDeleteModal(false);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        {/* Table Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">Customers</h2>
          {/* Search */}
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

            {showModal && (
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                size="lg"
              >
                <Modal.Body>
                  <div className="flex justify-center">
                    <img
                      src={selectedImage}
                      alt="Driving License"
                      className="w-auto h-auto max-w-full max-h-[80vh] rounded-lg"
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Close
                  </button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            pageSize={usersPerPage}
            totalEntries={filteredUsers.length}
          />
        </div>
      </div>
      {/* Edit Modal */}
      {showEditModal && (
        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Edit Customer</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  type="text"
                  value={currentUser.username}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, username: e.target.value })
                  }
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput
                  id="phone"
                  type="text"
                  value={currentUser.phone}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, phone: e.target.value })
                  }
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="role" value="Role" />
                <TextInput
                  id="role"
                  type="text"
                  value={currentUser.role}
                  disabled
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Label value="Upload Driver's License" />
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
            <Button onClick={handleSaveEdit}>Save Changes</Button>
            <Button onClick={() => setShowEditModal(false)} color="gray">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <Modal.Header>
            <HiOutlineExclamationCircle className="h-6 w-6 text-red-600" />
            Confirm Delete
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={confirmDelete} color="failure">
              Confirm
            </Button>
            <Button onClick={() => setShowDeleteModal(false)} color="gray">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
