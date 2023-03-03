import axios from 'axios';

const noteBaseURL = "http://localhost:5000/api/v1/notes"

function getAxios() {
  return axios.create({
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token')
    },
    withCredentials: true
  })
}
class NoteService {
  getAll(uid_data) {
    return axios.get(noteBaseURL, {params: uid_data});
  }

  get(id) {
    return axios.get(noteBaseURL + '/' + id);
  }

  update(id, data) {
    return axios.put(noteBaseURL + '/' + id, data);
  }

  delete(id) {
    return axios.delete(noteBaseURL + '/' + id);
  }

}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default new NoteService();