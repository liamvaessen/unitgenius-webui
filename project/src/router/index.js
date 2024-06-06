import { createRouter, createWebHistory } from 'vue-router'

import SignIn from '@/CyberryGeneral/views/SignIn.vue'
import SignUp from '@/CyberryGeneral/views/SignUp.vue'
import UserAccount from '@/CyberryGeneral/views/UserAccount.vue'
import AuthService from '@/CyberryGeneral/services/AuthService.js'

import GeneratorsView from '../views/GeneratorsView.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GeneratorsView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/generators',
      name: 'generators',
      component: GeneratorsView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/account',
      name: 'UserAccount',
      component: UserAccount
    },
    // Catch-all route
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    try{
      const userData = await AuthService.getCurrentUser();
      if (userData != null && userData.id != null) {
        next()
      } else {
        // User is not authenticated, redirect to sign in page
        next('/signin')
      }
    } catch {
        // User is not authenticated, redirect to sign in page
        next('/signin')
    }
  } else {
    next()
  }
})

export default router
