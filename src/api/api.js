import axios from "axios";
import router from "../router/router.js";

//각 페이지마다 axios를 일일이 부르는것보다도, 이렇게 라이브러리화 해좋은게 좋다.

const DOMAIN = "http://localhost:3000";
const UNAUTHORIZED = 401;
const onUnauthorized = () => {
  router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`);
};

const request = (method, url, data) => {
  //axios는 객체 형식으로도 선언할수 있다.
  return axios({
    method,
    url: DOMAIN + url,
    data,
  })
    .then((result) => result.data)
    .catch((error) => {
      // destructuring....This is same as .....const status = error.response.status;
      const { status } = error.response;
      if (status === UNAUTHORIZED) onUnauthorized()
      throw error.response;
    });
};


export const setAuthInHeader = token => {
  axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : null
}

export const board = {
  fetch() {
    return request("get", "/boards");
  },
};

export const auth = {
  login(email, password) {
    return request("post", "/login", {email, password});
  },
};

// 단순한 방식. 어디까지나 참고로.
// axios
// .get("http://localhost:3000/boards")
// .then((response) => {
//   this.boards = response.data;
// })
// .catch(() => {
//   //보드정보불러오기 실패는 로그인 페이지로 리다이렉트 한다.(this.$router사용)
//   this.$router.replace("/login");
// })

//Axios가 아닌 방법. 어디까지나 참고로.
//1.XMLHttpRequest Request instance.
//const req = new XMLHttpRequest();
//2. Method & URL
// req.open("GET", "http://localhost:3000/health");
// // 3. Send Request to server
// req.send();
// // 4.When Request is done, 'load' event will emerge. Catch this event for getting response data.
// req.addEventListener('load', ()=> {
//   this.loading = false
//   this.apiRes = {
//     status: req.status,
//     statusText: req.statusText,
//     response: JSON.parse(req.response)
//   }
// })
