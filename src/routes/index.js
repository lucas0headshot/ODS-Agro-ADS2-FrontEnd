import {createRouter, createWebHashHistory} from 'vue-router';

import Fornecedores from '../views/fornecedores.vue';
import Clientes from '../views/clientes.vue';
import Estoque from '../views/estoque.vue';
import Vendas from '../views/vendas.vue';

const routes = [
  { path: '/', component: Fornecedores },
  { path: '/fornecedores', component: Fornecedores },
  { path: '/clientes', component: Clientes },
  { path: '/estoque', component: Estoque },
    { path: '/vendas', component: Vendas },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;