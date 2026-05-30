import axios from "axios";

const API = axios.create({
  baseURL: "https://list-mortified-spied.ngrok-free.dev", // 🔥 yaha apna ngrok URL
});

// 🔥 Automatically token add karega (har request me)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = "Bearer " + token;
  }

  return req;
});

export default API;