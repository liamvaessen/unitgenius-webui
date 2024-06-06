import axios from 'axios'

const baseUrl = process.env.VUE_APP_UNITGENIUS_GATEWAY_URL;

const AuthService = {
  async signUp(signUpRequest) {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');

    return await axios.post(`${baseUrl}/auth/register`, signUpRequest)
  },
  async signIn(signInRequest) {
    return await axios.post(`${baseUrl}/auth/login`, signInRequest)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('jwtToken', response.data.token)
        }
        return response
      })
  },
  async getCurrentUser() {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const response = await axios.get(`${baseUrl}/auth/get`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });
      if (response.status === 200) {
        localStorage.setItem('userData', JSON.stringify(response.data));
        return response.data;
      } else {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        return null;
      }
    } 
    else {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userData');
      return null;
    }
  },  
  async getUserById(userId) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const response = await axios.get(`${baseUrl}/user/get/userId?userId=${userId}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    }
  },  
  async getUserByUsername(username) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const response = await axios.get(`${baseUrl}/user/get/username?username=${username}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    }
  }, 
  async getUserByEmail(email) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const response = await axios.get(`${baseUrl}/user/get/email?email=${email}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    }
  }, 
  async deleteUser(userId) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const response = await axios.delete(`${baseUrl}/user/delete/userId?userId=${userId}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return null;
      }
    }
  }, 
  getStoredUser() {
    return JSON.parse(localStorage.getItem('userData'))
  },
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
  }
}

export default AuthService
