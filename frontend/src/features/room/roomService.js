import axios from "axios";
import { API_URL_PROXY } from "../../config/config";

const API_URL = `${API_URL_PROXY}/rooms/`;

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

// Delete room

const deleteRoom = async (roomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(API_URL + roomId, config);
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
  deleteRoom,
};

export default roomService;
