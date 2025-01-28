import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage/HomePage.vue';
import ProductPage from '../pages/Product/ProductPage.vue';
import CartPage from '../pages/Cart/CartPage.vue'
import Register from '../components/Register/Register.vue';
import Login from '../components/Login/Login.vue'
import OrderPage from '../pages/Order/OrderPage.vue';
import OrderTracking from '../pages/Tracking/OrderTracking.vue';
import ProfilePage from '../pages/Profile/ProfilePage.vue';
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/products/:id',
    name: 'ProductDescription',
    component: ProductPage,
    //path variable
    props:true
  },
  {
    path :'/cart',
    name:'MyCart',
    component:CartPage,
  },
  {
    path:'/register',
    name:'Register',
    component:Register,
  },
  {
    path:'/orders',
    name:'Order',
    component: OrderPage
  },
  {
    path:'/order-tracking',
    name:'OrderTracking',
    component:OrderTracking
  },
  {
    path:'/profile',
    name:'Profile',
    component:ProfilePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated')==='true';
   console.log(isAuthenticated);
  if (to.name === 'Home' || to.name === 'Login'|| to.name === 'Register') {
    next();
    }
  else if (!isAuthenticated) {
    next({ name: 'Login' }); 
  } 
  else {
    next(); 
    }
  });

export default router;
