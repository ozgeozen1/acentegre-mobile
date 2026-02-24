import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Burada hata formatını standartlaştıracağız
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Beklenmeyen bir hata oluştu.";
    return Promise.reject(new Error(message));
  }
);
