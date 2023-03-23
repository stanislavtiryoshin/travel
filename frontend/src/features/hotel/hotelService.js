import axios from "axios";

const API_URL = "/api/hotels/";

//  Add new hotel

const addHotel = async (hotelData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, hotelData, config);
  return response.data;
};

// Get all hotels

const getHotels = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get searched hotels

const getSearchedHotels = async (locationId) => {
  const response = await axios.get(API_URL + "searched/" + locationId);
  return response.data;
};

// Get single hotel

const getSingleHotel = async (hotelId) => {
  const response = await axios.get(API_URL + hotelId);
  return response.data;
};

const hotelService = {
  addHotel,
  getHotels,
  getSearchedHotels,
  getSingleHotel,
};

export default hotelService;
