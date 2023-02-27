import axios from 'axios';

const userBaseURL = "http://localhost:5000/api/v1/users"
class UserService {
  getAll() {
    return axios.get(userBaseURL);
  }

  get(id) {
    return axios.get(userBaseURL + '/' + id);
  }

  create(data) {
    return axios.post(userBaseURL, data);
  }

  update(id, data) {
    return axios.put(userBaseURL + '/' + id, data);
  }

  delete(id) {
    return axios.delete(userBaseURL + '/' + id);
  }
  
}

export default new UserService();