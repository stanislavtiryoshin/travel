import axios from "axios";

const API_URL = "/api/rooms/";

//  Add new room

const addRoom = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, roomData, config);
  return response.data;
};

const roomService = {
  addRoom,
};

export default roomService;
