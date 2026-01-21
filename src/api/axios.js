import axios from "axios";

const api = axios.create({
  baseURL: "https://pc-build-websiteabackend-2.onrender.com/api",
});

export default api;
