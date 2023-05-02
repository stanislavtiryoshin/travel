import axios from "axios";

const API_URL = "https://easy-plum-panther-tam.cyclic.app/api/orders/";

//  Add new order

const addOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};

// Get all orders

const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const editOrder = async (orderId, orderData, token) => {
  const response = await axios.put(API_URL + orderId, orderData);
  return response.data;
};

const orderService = {
  addOrder,
  getOrders,
  editOrder,
};

export default orderService;
