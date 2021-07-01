import React from "react";

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal d-block" : "modal d-none";

  return (
    <div className={showHideClassName}>
      <div className="modal-container">
         {/* eslint-disable-next-line */}
        <a href="javascript:;" className="modal-close" onClick={handleClose}>
          Close
        </a>
        {children}
      </div>
    </div>
  );
};

export default Modal;