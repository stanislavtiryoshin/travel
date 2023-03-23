import React from "react";

import room from "../../assets/room.png";

const Room = ({ roomPrice, roomName, chooseRoom, active, days }) => {
  return (
    <div
      className={`room_box ${active ? "active" : ""}`}
      onClick={() => chooseRoom(roomName, roomPrice)}
    >
      <div className="rooms_top">
        <img src={room} alt="" />
        {roomName}
      </div>
      <div className="rooms_bot">
        <div className="room_bot-left">
          <div className="room_bot-row">Цена номера</div>
          <div className="room_bot-row">{roomPrice} тг/ночь</div>
        </div>
        <div className="room_bot-right">
          <div className="room_bot-row">Итого за отель</div>
          <div className="room_bot-row">{days * roomPrice} тг</div>
        </div>
      </div>
    </div>
  );
};

export default Room;
