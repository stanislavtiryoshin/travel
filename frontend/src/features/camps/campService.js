import axios from "axios";

const API_URL = "/api/camps/";

// Get all camps

const getCamps = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const campService = {
  getCamps,
};

export default campService;
