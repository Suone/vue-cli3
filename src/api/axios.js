import axios from 'axios';
import router from '@/router';
axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/api/' : '/api/';

// POST传参序列化
axios.interceptors.request.use(
    config => {
        if (window.xtoken) {
            config.headers['x-hzdamei'] = window.xtoken;
        }
        if (config.method === 'post') {
            let formdata = new FormData();
            for (let k in config.data) {
                formdata.append(k, config.data[k]);
            }
            config.data = formdata;
        }
        return config;
    },
    error => {
        if (error) {
            console.log('axios.interceptors.request', error);
        }
        const err = {
            data: {
                code: 400,
                msg: '错误的传参!'
            }
        };
        return Promise.reject(err);
    }
);
// code状态码200判断
axios.interceptors.response.use(
    res => {
        if (Number(res.data.code) !== 200) {
            if (Number(res.data.code) === 403) {
                window.xtoken = '';
                router.push('/login');
            }
            return Promise.reject(res);
        }
        return res;
    },
    error => {
        if (error) {
            console.log('axios.interceptors.response', error);
        }
        const err = {
            data: {
                code: 404,
                msg: '网络有点慢,请稍后再试!'
            }
        };
        return Promise.reject(err);
    }
);

export default axios;
