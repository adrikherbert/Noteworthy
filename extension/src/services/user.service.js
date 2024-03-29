import axios from 'axios';

const userBaseURL = "http://localhost:5000/api/v1/users"


function getAxios() {
  return axios.create({
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token')
    },
    withCredentials: true
  })
}
class UserService {
  getAll() {
    return axios.get(userBaseURL);
  }

  get(id) {
    return getAxios().get(userBaseURL + '/' + id);
  }

  login(info) {
    return axios.post("http://localhost:5000/auth/login", info, {withCredentials: true});
  }

  create(data) {
    return axios.post(userBaseURL, data);
  }

  update(id, data) {
    return getAxios().put(userBaseURL + '/' + id, data);
  }

  delete(id) {
    return axios.delete(userBaseURL + '/' + id);
  }

}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default new UserService();