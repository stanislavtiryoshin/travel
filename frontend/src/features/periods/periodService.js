import axios from "axios";

const API_URL = "/api/periods/";

// Add new periods

const addPeriods = async (periods, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, periods, config);
  return response.data;
};

const periodService = {
  addPeriods,
};

export default periodService;
