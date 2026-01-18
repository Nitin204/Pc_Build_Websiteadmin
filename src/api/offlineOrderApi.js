import axios from "axios";

const API_URL = "http://localhost:8080/api/offline-orders";

export const getOfflineOrders = () => axios.get(API_URL);

export const addOfflineOrderApi = (order) =>
  axios.post(API_URL, order);

export const updateOfflineOrderApi = (id, order) =>
  axios.put(`${API_URL}/${id}`, order);

export const deleteOfflineOrderApi = (id) =>
  axios.delete(`${API_URL}/${id}`);
