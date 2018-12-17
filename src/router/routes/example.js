const base = [
    {
        path: '/',
        component: resolve => {
            require.ensure(['@/views/index'], require => {
                resolve(require('@/views/index'));
            });
        }
    },

    {
        path: '/about',
        // redirect: '/study_center/pdu/personal_data',
        component: resolve => {
            require.ensure(['@/views/about'], require => {
                resolve(require('@/views/about'));
            });
        }
    }
];

export default base;
