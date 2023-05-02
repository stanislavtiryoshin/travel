import axios from "axios";

const API_URL = "https://easy-plum-panther-tam.cyclic.app/api/hotelServices/";

// Add new hotel service

const addService = async (serviceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, serviceData, config);
  return response.data;
};

const hotelServService = {
  addService,
};

export default hotelServService;
