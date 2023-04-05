import { useState } from "react";
import style from "./Modal.module.scss";

const Modal = ({ children, isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div className={style.modal_container}>
          <div className={style.close} onClick={() => setIsOpen(false)}>
            X
          </div>
          <div className={style.modal}>{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
