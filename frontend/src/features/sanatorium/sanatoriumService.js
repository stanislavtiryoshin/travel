import axios from "axios";

const API_URL = "/api/sanatoriums/";

// Get all tours

const getSanatoriums = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Update sanatorium

const updateSanatorium = async (hotelData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    API_URL + hotelData._id,
    hotelData,
    config
  );
  return response.data;
};

// Get single sanatorium

const getSingleSanatorium = async (sanatoriumId) => {
  const response = await axios.get(API_URL + sanatoriumId);
  return response.data;
};

const getSearchedSanatoriums = async (
  locationId,
  peopleAmount,
  daysAmount,
  start,
  adultsAmount,
  kidsAmount
) => {
  const params = {
    locationId,
    peopleAmount,
    daysAmount,
    start,
    adultsAmount,
    kidsAmount,
  };
  const response = await axios.get(API_URL + "searched", { params });
  return response.data;
};

const sanatoriumService = {
  getSanatoriums,
  getSingleSanatorium,
  getSearchedSanatoriums,
  updateSanatorium,
};

export default sanatoriumService;
