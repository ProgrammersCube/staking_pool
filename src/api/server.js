import axios from "axios";

//dev url

//export const baseUrl = "http://51.222.241.160:8001/api/";

export const baseUrl = "https://mmm-bk.herokuapp.com/api/";

// export const baseUrl = "https://8e549e6c70b3.ngrok.io";
export default axios.create({
  baseURL: baseUrl,
});
