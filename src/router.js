import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Shtats from './components/Shtats.vue'

const router = createRouter({
  history: createWebHistory(),
  base: '/dust-shtats/',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/shtats',
      name: 'Shtats',
      component: Shtats,
      meta: { requiresAuth: true } // add meta field to require authentication
    }
  ]
})

// In your router.beforeEach hook, check if the user is authenticated before accessing protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      // User is not authenticated, redirect to login page
      next();
    } else {
      // User is authenticated, continue to the desired route
      next();
    }
  } else {
    // Route does not require authentication, continue to the desired route
    next();
  }
})

export default router