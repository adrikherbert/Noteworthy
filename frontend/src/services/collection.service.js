import axios from 'axios';

const colBaseURL = "http://localhost:5000/api/v1/collections"

function getAxios() {
  return axios.create({
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token')
    },
    withCredentials: true
  })
}
class CollectionService {
  getAll(uid_data) {
    return axios.get(colBaseURL, {params: uid_data});
  }

  get(id) {
    return axios.get(colBaseURL + '/' + id);
  }

  create(data) {
    return axios.post(colBaseURL, data);
  }

  update(id, data) {
    return axios.put(colBaseURL + '/' + id, data);
  }

  delete(id) {
    return axios.delete(colBaseURL + '/' + id);
  }

}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default new CollectionService();