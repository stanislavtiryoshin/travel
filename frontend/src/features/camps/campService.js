import axios from "axios";

const API_URL = "/api/camps/";

// Get all camps

const getCamps = async () => {
  const response = await axios.get(API_URL);
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

const campService = {
  getCamps,
  updateAgePriceById,
};

export default campService;
