import axios from "axios";

const API_URL = "/api/sanatorium/";

// Get all tours

const getSanatoriums = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const sanatoriumService = {
  getSanatoriums,
};

export default sanatoriumService;
