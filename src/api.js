import axios from "axios";
import Cookies from 'js-cookie';

var baseUrl = "https://eat-sleep-nintendo-repeat.eu/api"

const instance = axios.create({
  baseURL: baseUrl
})

//add auth header to all request
instance.interceptors.request.use(
  (config) => {
    var access_token = localStorage.getItem("accessToken");
    if (access_token) {
      config.headers["Authentication"] = `Access ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;


      try {
        const rs = await axios.get(`${baseUrl}/auth/accesstoken`, {withCredentials: true}).catch(e => {
          //redirect to loginpage if refresh_token is not valid
          if (e.response && e.response.status === 401) {
            window.location = baseUrl + `/auth/discord?redirect=${window.location.href}`
          }
        });

        const {token} = rs.data;
        localStorage.setItem("accessToken", token);

        return instance(originalConfig);
      } catch (_error) {
        return Promise.reject(_error)
      }
    }
    return Promise(err);
  }
);

export { instance as axios, baseUrl }
