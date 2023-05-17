import axios from "axios";

const API_URL = "/api/camps/";

// Get all camps

const getCamps = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single camp

const getSingleCamp = async (campId) => {
  const response = await axios.get(API_URL + campId);
  return response.data;
};

// Update age prices of one camp

const updateAgePriceById = async (agePriceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${API_URL}ageprice/${agePriceData.campId}`,
    {
      periodPrices: agePriceData.periodPrices,
      agePriceId: agePriceData.agePriceId,
    },
    config
  );
  return response.data;
};

// Add age to camp

const addAge = async (ageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${API_URL}age/${ageData.campId}`,
    ageData.ages,
    config
  );
  return response.data;
};

const deleteAge = async (ageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(
    `${API_URL}age/${ageData.campId}/${ageData.ageId}`,
    config
  );
  return response.data;
};

const campService = {
  getCamps,
  updateAgePriceById,
  getSingleCamp,
  addAge,
  deleteAge,
};

export default campService;
