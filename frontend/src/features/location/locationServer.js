import axios from "axios";

const API_URL = "/api/locations/";

// Get location
const getLocations = async (locationId) => {
  const response = await axios.get(API_URL + locationId);
  return response.data;
};

const locationService = {
  getLocations,
};

export default locationService;
