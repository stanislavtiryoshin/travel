import React, { useState } from "react";
import { Link } from "react-router-dom";

import eye from "../../assets/room/eye.svg";
import roomphoto from "../../assets/room/room.png";
import bed from "../../assets/room/bed.svg";
import grncheck from "../../assets/room/greencheck.svg";

const DashRoom = ({ room }) => {
  return (
    <div className="admin_room-card">
      <div className="admin_room-card-top">
        <div className="admin_room-img-box">
          <img src={roomphoto} alt="" />
        </div>
        <div className="admin_room-content">
          <div className="admin_room-title">{room.roomName}</div>
          <div className="admin_room-bed row">
            <img src={bed} alt="" />
            {room.beds.largeBeds} большие кровати
          </div>
          <RoomTags />
        </div>
      </div>
      <div className="admin_room-bot">
        <Link
          to={`/dashboard/rooms/${room._id}`}
          target={"_blank"}
          className="bottom-btn clear"
        >
          Подробнее <img src={eye} alt="" />
        </Link>
      </div>
    </div>
  );
};

export const RoomTags = ({ tags }) => {
  return (
    <div className="admin_room-tags">
      {tags.map((tag, idx) => {
        return (
          <div className="room_tag-card">
            <img src={grncheck} alt="" />
            {idx < 2 ? tag : null}
          </div>
        );
      })}
    </div>
  );
};

export default DashRoom;
