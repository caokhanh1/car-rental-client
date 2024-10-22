import { Modal, Button } from "flowbite-react";
import PropTypes from "prop-types";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DeleteVehicleType = ({ show, onClose, confirmDelete }) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>
        <HiOutlineExclamationCircle className="h-6 w-6 text-red-600" />
        Confirm Delete
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete this vehicle type? This action cannot
          be undone.
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

DeleteVehicleType.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
};

export default DeleteVehicleType;
