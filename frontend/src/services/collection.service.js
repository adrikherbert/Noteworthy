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
    return getAxios().get(colBaseURL, uid_data);
  }

  get(id) {
    return getAxios().get(colBaseURL + '/' + id);
  }

  create(data) {
    return getAxios().post(colBaseURL, data);
  }

  update(id, data) {
    return getAxios().put(colBaseURL + '/' + id, data);
  }

  delete(id) {
    return getAxios().delete(colBaseURL + '/' + id);
  }

}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default new CollectionService();