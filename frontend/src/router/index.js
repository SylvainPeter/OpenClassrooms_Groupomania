/**************************************************************************
  * IMPORTS
  ***************************************************************************/
import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '../views/LogIn.vue'
import SignUp from '../views/SignUp.vue'
import HomePage from '../views/HomePage.vue'
import PublishPost from '../views/PublishPost.vue'
import EditPost from '../views/EditPost.vue'

/**************************************************************************
  * FUNCTION
  ***************************************************************************/

// AUTHENTIFICATION
function tokenAccess(to, from, next) {
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user.token) // si l'utilisateur dispose d'un token
  {
    next(); // alors seulement on autorise la route
  }
}

// VIDE LE LOCAL STORAGE
function clearLocalStorage(to, from, next) {
  localStorage.clear();
  next();
}


/**************************************************************************
  * ROUTES
  ***************************************************************************/

const routes = [
  {
    path: '/',
    name: 'LogIn',
    beforeEnter: clearLocalStorage,
    component: LogIn,
  },
  {
    path: '/signup',
    name: 'SignUp',
    beforeEnter: clearLocalStorage,
    component: SignUp,
  },
  {
    path: '/home',
    name: 'Home',
    beforeEnter: tokenAccess, // route interdite si pas de token
    component: HomePage,
  },
  {
    path: '/publish',
    name: 'Publish',
    component: PublishPost,
  },
  {
    path: '/edit/:id',
    name: 'EditPost',
    component: EditPost,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
