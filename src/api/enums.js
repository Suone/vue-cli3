import http from './http';

export default {
    // 枚举
    enums: opts => {
        const url = '/user/utils/enums';
        const data = {};
        return http.get(url, data);
    }
};
