import {createRouter, createWebHashHistory} from 'vue-router';

import About from '../views/about.vue';
import Products from '../views/products.vue';

const routes = [
    { path: '/', component: Products },
    { path: '/about', component: About },
    // { path: '/rota', component: viewImportada },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;