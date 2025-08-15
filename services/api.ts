import axios from "axios";
import https from "https";
// import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://localhost:7269/api", 
    httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

api.interceptors.request.use((config) => {
  // const token = getToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;