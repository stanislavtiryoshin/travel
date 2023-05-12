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

// Delete period

const deletePeriod = async (periodId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(API_URL + periodId, config);
};

const periodService = {
  addPeriods,
  deletePeriod,
};

export default periodService;
