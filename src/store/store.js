import VueX from "vuex";
import Vue from "vue";
//import * as api from "../api/api.js";
import state from './state.js'
import getters from './getters.js'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(VueX);

const store = new VueX.Store({
  state,
  getters,
  //동기적인 로직은 mutations로!
  mutations,
  //비동기적은 로직은 action으로!
  actions
});

//앱이  구동될때  토큰정보를 처리하는 로직
const {token} = localStorage
store.commit('LOGIN', token)


export default store;
