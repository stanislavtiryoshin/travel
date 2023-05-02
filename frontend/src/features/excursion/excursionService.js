import axios from "axios";

const API_URL = "https://easy-plum-panther-tam.cyclic.app/api/excursions/";

// Get searched hotels

const getExcursions = async (locationId) => {
  const response = await axios.get(API_URL + locationId);
  return response.data;
};

const excursionService = {
  getExcursions,
};

export default excursionService;
