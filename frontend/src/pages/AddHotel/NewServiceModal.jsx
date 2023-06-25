import React from "react";
import Modal from "../../components/Modal";
import { useDispatch } from "react-redux";
import { addService } from "../../features/hotelService/hotelServSlice";
import { Input } from "../../components/Form";

const NewServiceModal = ({
  isOpen,
  setIsOpen,
  newService,
  setNewService,
  allCategories,
}) => {
  const dispatch = useDispatch();
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="modal-content">
        <div className="modal-title">
          Хотите добавить новую <br /> услугу?
        </div>
        <div className="modal-body">
          <span className="modal-select-text">Название новой услуги</span>
          <select
            name=""
            id=""
            className="primary-input"
            style={{ width: "100%", marginTop: "22px" }}
            onChange={(e) =>
              setNewService({ ...newService, category: e.target.value })
            }
          >
            {allCategories?.map((categ) => {
              return <option value={categ._id}>{categ.categoryName}</option>;
            })}
          </select>
          <Input
            style={{ width: "100%", marginTop: "22px" }}
            placeholder="Услуга"
            onChange={(e) =>
              setNewService({
                ...newService,
                hotelServiceName: e.target.value,
              })
            }
          />
          <div className="modal-button">
            <button
              style={{ width: "100%", marginTop: "10px" }}
              className="primary-btn"
              onClick={() => dispatch(addService(newService))}
            >
              <span>Добавить услугу</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewServiceModal;
