// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import api from '@/api';
import constant from '@/constant';
import store from '@/store';
import router from '@/router';
import ElementUI from 'element-ui';
import scripts from '@/scripts';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles';
import App from '@/App';
import VueLazyLoad from 'vue-lazyload';
Vue.use(VueLazyLoad, {
    // loading: './assets/images/load.svg',
    // listenEvents: ['scroll']
});
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$const = constant;
Vue.prototype.$scripts = scripts;
Vue.config.silent = true;
// router.afterEach((to, from, next) => {
//     window.scrollTo(0, 0);
// });
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
