import axios from "axios";

const API_URL = "https://easy-plum-panther-tam.cyclic.app/api/sanatoriums/";

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

const sanatoriumService = {
  getSanatoriums,
  getSingleSanatorium,
};

export default sanatoriumService;
