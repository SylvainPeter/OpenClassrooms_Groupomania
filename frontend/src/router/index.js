/**************************************************************************
  * IMPORTS
  ***************************************************************************/
import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '../views/LogIn.vue'
import SignUp from '../views/SignUp.vue'
import HomePage from '../views/HomePage.vue'

/**************************************************************************
  * FUNCTION
  ***************************************************************************/

// PROTEGE LES ROUTES
function guardMyroute(to, from, next) {
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user.token) // si l'utilisateur dispose d'un token
  {
    next(); // alors seulement on autorise la route
  }
  else {
    next('/');
  }
}

/**************************************************************************
  * ROUTES
  ***************************************************************************/

const routes = [
  {
    path: '/',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/home',
    name: 'Accueil',
    beforeEnter: guardMyroute,
    component: HomePage,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
