import { createRouter, createWebHistory } from 'vue-router';
import { storageAvailable } from './util.js';
import auth from './auth.js';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/home/Home.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/login/Login.vue'),
        },
    ]
});

router.beforeEach(async (to) => {
    if (!auth.user.value) {
        if (storageAvailable('localStorage')) {
            if (localStorage.accessToken) {
                auth.login(localStorage.accessToken);
            }
        }
    }
});

export default router;
