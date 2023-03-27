import React from "react";

import roompic from "../../assets/room.png";

const Room = ({ room, chooseRoom, active, days, sum }) => {
  return (
    <div
      className={`room_box ${active ? "active" : ""}`}
      onClick={() => chooseRoom(room)}
    >
      <div className="rooms_top">
        <img src={roompic} pic alt="" />
        {room?.roomName}
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
