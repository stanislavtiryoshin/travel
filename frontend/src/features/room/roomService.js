import axios from "axios";

const API_URL = "https://easy-plum-panther-tam.cyclic.app/api/rooms/";

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

//  Get single room

const getSingleRoom = async (roomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + roomId, config);
  return response.data;
};

// Update room

const updateRoom = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(API_URL + roomData._id, roomData, config);
  return response.data;
};

const roomService = {
  addRoom,
  getSingleRoom,
  updateRoom,
};

export default roomService;
