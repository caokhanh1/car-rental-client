import { Modal, Button, Label, TextInput } from "flowbite-react";
import PropTypes from "prop-types";

const CreateVehicleType = ({
  show,
  onClose,
  newVehicleType,
  setNewVehicleType,
  handleInputChange,
  handleCreateVehicleType,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Create Vehicle Type</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="type" value="Type" />
            <TextInput
              id="type"
              name="type"
              type="text"
              value={newVehicleType.type || ""}
              onChange={(e) => handleInputChange(e, setNewVehicleType)}
            />
          </div>
          <div>
            <Label htmlFor="detail" value="Detail" />
            <TextInput
              id="detail"
              name="detail"
              type="text"
              value={newVehicleType.detail || ""}
              onChange={(e) => handleInputChange(e, setNewVehicleType)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateVehicleType} color="dark">
          Create Vehicle Type
        </Button>
        <Button onClick={onClose} color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CreateVehicleType.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newVehicleType: PropTypes.shape({
    type: PropTypes.string,
    detail: PropTypes.string,
  }).isRequired,
  setNewVehicleType: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleCreateVehicleType: PropTypes.func.isRequired,
};

export default CreateVehicleType;
