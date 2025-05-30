import Axios from "axios";

export default Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  responseType: "json",
  timeout: 20_000,
});
