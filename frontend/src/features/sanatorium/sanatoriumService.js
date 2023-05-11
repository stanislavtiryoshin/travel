import axios from "axios";

const API_URL = "/api/sanatoriums/";

// Get all tours

const getSanatoriums = async () => {
  const response = await axios.get(API_URL);
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
  startDate,
  adultsAmount,
  kidsAmount
) => {
  const params = {
    locationId,
    peopleAmount,
    daysAmount,
    startDate,
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
};

export default sanatoriumService;
