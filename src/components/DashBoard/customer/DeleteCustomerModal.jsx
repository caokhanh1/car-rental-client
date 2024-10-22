import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import PropTypes from "prop-types";
import useAxios from "../../../utils/useAxios";

const DeleteCustomerModal = ({ show, onClose, userIdToDelete, setUsers }) => {
  const api = useAxios();

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${userIdToDelete}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userIdToDelete)
      );
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
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
        <Button onClick={onClose} color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
DeleteCustomerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userIdToDelete: PropTypes.string.isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default DeleteCustomerModal;
