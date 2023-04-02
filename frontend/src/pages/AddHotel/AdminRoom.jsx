import React, { useState } from "react";

import eye from "../../assets/room/eye.svg";

const AdminRoom = ({ room }) => {
  return (
    <div className="admin_room-card shadowed_box">
      <div className="admin_room-top"></div>
      <div className="admin_room-bot">
        <button className="bottom-btn clear">
          Подробнее <img src={eye} alt="" />
        </button>
      </div>
    </div>
  );
};

export default AdminRoom;
