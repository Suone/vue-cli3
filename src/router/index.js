import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
console.log(process.env.NODE_ENV);
process.env.NODE_ENV === 'development' && Vue.use(Router);

const router = new Router({
    routes
});
// router.beforeEach((to, from, next) => {
//     // 登录白名单
//     if (['/login', '/register', '/findPwd', '/forget_reset', '/agreement'].indexOf(to.path) !== -1) {
//         next();
//     } else if (!window.xtoken) {
//         next({
//             path: '/login',
//             query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         });
//         next();
//     } else {
//         next();
//     }
// });
export default router;
