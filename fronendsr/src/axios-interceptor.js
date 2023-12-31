import axios from "axios";

const axiosConfig = {};

axios.interceptors.request.use((request) => {
  if (axiosConfig.jwt) {
    axios.defaults.headers.common("Authorization", `Bearer ${axiosConfig.jwt}`);
  }

  return request;
});

export default axiosConfig;
