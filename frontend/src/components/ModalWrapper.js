const ModalWrapper = ({ children, onClose }) => {
    return (
      <div 
        className="modal-wrapper" 
        onClick={onClose} // Close the modal when the background is clicked
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000, // Make sure it's above everything else
        }}
      >
        <div onClick={(e) => e.stopPropagation()}> {/* Prevent click from closing the modal */}
          {children}
        </div>
      </div>
    );
  };
  