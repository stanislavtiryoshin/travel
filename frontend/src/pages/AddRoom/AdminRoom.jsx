import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getSingleRoom } from "../../features/room/roomSlice";

import AddRoom from "./AddRoom";

const AdminRoom = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  const { singleRoom, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.rooms
  );

  useEffect(() => {
    dispatch(getSingleRoom(roomId));
  }, [roomId]);

  console.log(singleRoom);

  return (
    <>
      <AddRoom fetchedRoomData={singleRoom} editMode />
    </>
  );
};

export default AdminRoom;
