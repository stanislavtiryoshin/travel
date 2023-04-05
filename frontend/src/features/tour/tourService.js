import axios from "axios";

const API_URL = "/api/tour/";

// Get all tours

const getTours = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const tourService = {
  getTours,
};

export default tourService;
