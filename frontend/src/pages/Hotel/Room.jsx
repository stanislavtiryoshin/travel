import React from "react";

import roompic from "../../assets/room.png";
import { RoomTags } from "../AddHotel/DashRoom";

import bed from "../../assets/bed.svg";
import food from "../../assets/food.svg";
import { addClientRoom, removeClientRoom } from "../../features/clientSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { useUploadImageMutation } from "../../features/services/upload.service";

import "./Room.scss";

const Room = ({ room, active, days, sum }) => {
  const [uploadImage] = useUploadImageMutation();
  const dispatch = useDispatch();
  const [bedCount, setBedCount] = React.useState(
    room?.beds?.largeBeds + room?.beds?.smallBeds
  );

  const [tags] = React.useState([
    `${room?.bathroom?.type === "Ванна" ? "Ванна" : "Душ"}`,
    room.bathExtras,
    room.roomServices,
  ]);

  return (
    <div
      className={`room_box ${active ? "active" : ""}`}
      onClick={() => {
        active
          ? dispatch(removeClientRoom(room._id))
          : dispatch(addClientRoom(room));
      }}
    >
      <div className="rooms_top">
        <img src={roompic} pic alt="" />
        <div className="room_top-content">
          {room?.roomName}
          <div className="additional_tag">
            <div className="room_bed">
              <img src={bed} alt="" />
              {bedCount} кровати
            </div>
            <div className="room_food">
              <img src={food} alt="" />
              {room?.food ? "Завтрак включен" : "Завтрак не включен"}
            </div>
          </div>
          <RoomTags tags={tags.flat()} />
        </div>
      </div>

      <div className="rooms_bot">
        <div className="room_bot-left">
          <div className="room_bot-row">Цена номера</div>
          <div className="room_bot-row">{room?.roomPrice} тг/ночь</div>
        </div>
        <div className="room_bot-right">
          <div className="room_bot-row">Итого за отель</div>
          <div className="room_bot-row">{sum} тг</div>
        </div>
      </div>
    </div>
  );
};

export default Room;
