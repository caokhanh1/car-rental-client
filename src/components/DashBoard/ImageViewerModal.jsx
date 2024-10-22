import { Button, Modal } from "flowbite-react";
import PropTypes from "prop-types";

const ImageViewerModal = ({ show, onClose, imageUrl }) => {
  return (
    <Modal show={show} onClose={onClose} size="lg">
      <Modal.Body>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Driving License"
            className="w-auto h-auto max-w-full max-h-[80vh] rounded-lg"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} color="dark">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ImageViewerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default ImageViewerModal;
