import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import router from './router/router.js';
import store from './store/store.js'

//Entry point-> 이 어플리케이션의 입구.
Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');