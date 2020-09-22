import VueRouter from "vue-router";

//components
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Board from "../components/Board.vue";
import Card from "../components/Card.vue";
import NotFound from "../components/NotFound.vue";

const requireAuth = (to, from, next) => {
  const isAuth = localStorage.getItem("token");
  //로그인후 가려고했던 페이지에 돌아갈수 있도록 리턴패스를 지정하다. 쿼리 문자열이기때문에 인코딩해줄 필요가 있다.
  const loginPath = `/login?rPath=${encodeURIComponent(to.path)}`;
  isAuth ? next() : next(loginPath);
};

//1.라우팅의 우선순위는 선언순이다.
//2.중첩라우팅의 경우, '/'가 있고없고가 중요하다.
//3.'beforeEnger'를 이용해 네비게이션 가드를 쓸수 있다. 이로서 비로그인 유저는 라우팅 직전에 로그인 화면으로 리다이렉트된다.
const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Home, beforeEnter: requireAuth },
    { path: "/login", component: Login },
    {
      path: "/b/:bid",
      component: Board, beforeEnter: requireAuth,
      children: [{ path: "c/:cid", component: Card, beforeEnter: requireAuth }],
    },
    { path: "*", component: NotFound },
  ],
});

export default router;
