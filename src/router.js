import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';

import LogIn from './components/LogIn.vue'
import SignUp from './components/SignUp.vue'
import Home from './components/Home.vue'
import Carrito from './components/Carrito.vue'
import Products from './components/Products.vue'
import Producto from './components/Producto.vue'
import FormProducto from './components/FormProducto.vue'
import Compras from './components/Compras.vue'
import VerCompra from './components/VerCompra.vue'

const routes = [{
        path: '/',
        name: 'root',
        component: Products
    },
    {
        path: '/user/logIn',
        name: "logIn",
        component: LogIn
    },
    {
        path: '/user/signUp',
        name: "signUp",
        component: SignUp
    },
    {
        path: '/user/home',
        name: "home",
        component: Home
    },
    {
        path: '/user/cart',
        name: "carrito",
        component: Carrito
    },
    {
        path: '/user/products',
        name: "products",
        component: Products
    },
    {
        path: '/product/:producto',
        name: "producto",
        component: Producto
    },
    {
        path: '/manage-product/:action/:producto?',
        name: "formProducto",
        component: FormProducto
    },
    {
        path: '/user/purchases',
        name: "purchases",
        component: Compras
    },
    {
        path: '/user/factura/:idCarrito',
        name: "factura",
        component: VerCompra
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;