import { Modal, Button, Label, TextInput } from "flowbite-react";
import PropTypes from "prop-types";

const EditVehicleType = ({
  show,
  onClose,
  currentVehicleType,
  setCurrentVehicleType,
  handleInputChange,
  handleUpdateVehicleType,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Edit Vehicle</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="type"
              type="text"
              name="type"
              value={currentVehicleType.type}
              onChange={(e) => handleInputChange(e, setCurrentVehicleType)}
            />
          </div>
          <div>
            <Label htmlFor="detail" value="Detail" />
            <TextInput
              id="detail"
              name="detail"
              type="text"
              value={currentVehicleType.detail}
              onChange={(e) => handleInputChange(e, setCurrentVehicleType)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdateVehicleType} color="dark">
          Save Changes
        </Button>
        <Button onClick={onClose} color="gray">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EditVehicleType.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentVehicleType: PropTypes.shape({
    type: PropTypes.string,
    detail: PropTypes.string,
  }).isRequired,
  setCurrentVehicleType: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleUpdateVehicleType: PropTypes.func.isRequired,
};

export default EditVehicleType;
