import axios from "axios";
const headers = {
  "Content-Type": "application/json"
};
const burl = "http://localhost:8080";

export default {
  login: function(email, password) {
    return axios.post(
      `${burl}/users/login`,
      {
        email,
        password
      },
      {
        headers: headers
      }
    );
  },
  signup: function(send) {
    return axios.post(`${burl}/user/signup`, send, { headers: headers });
  },

  isAuth: function() {
    return localStorage.getItem("token") !== null;
  },

  findPseudo: function(send) {
    return axios.post(`${burl}/user/get`, send, {headers: headers});
  },
  logout: function() {
    localStorage.clear();
  }
};

