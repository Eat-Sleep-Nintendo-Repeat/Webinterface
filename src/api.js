import axios from "axios";
import Cookies from 'js-cookie';

const baseUrl = "http://192.168.0.103:5670/api/v1"

//request interceptor to add the auth token header to requests
axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Access ${accessToken}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

//response interceptor to refresh token on receiving token expired error
axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      let refreshToken = Cookies.get("refresh_token")
  if (
        refreshToken &&
        error.response.status === 401 &&
        !originalRequest.retry
      ) {
        originalRequest.retry = true;
        return axios
          .get(`${baseUrl}/auth/token-exchange`, {withCredentials: true})
          .then((res) => {
            if (res.status === 200) {
              localStorage.setItem("accessToken", res.data.token);
              console.log("Access token refreshed!");
              return axios(originalRequest);
            }
          }).catch(e => {
            setTimeout(() => {
              window.location = `${baseUrl}/auth/discord?redirect=${window.location.href}`
            }, 500);
          });
      }
      else if (
        !refreshToken &&
        error.response.status === 401 &&
        !originalRequest.retry
      ) {
          window.location = `${baseUrl}/auth/discord?redirect=${window.location.href}`
      }
      return Promise.reject(error);
    }
  );

export { axios, baseUrl }