import axios from "axios";
import { BASE_URL } from "./constants";


const axiosnew = axios.create({
  baseURL: BASE_URL,
});

export default axiosnew;