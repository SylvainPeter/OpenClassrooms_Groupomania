/**************************************************************************
  * IMPORTS
  ***************************************************************************/
import { createRouter, createWebHistory } from 'vue-router'
import ls from 'localstorage-slim';
 
// enable global encryption
ls.config.encrypt = true;

/**************************************************************************
  * FUNCTION
  ***************************************************************************/

// AUTHENTIFICATION
function tokenAccess(to, from, next) {
  const user = JSON.parse(ls.get('userData'));
  if (user !== null && user.token) // si l'utilisateur dispose d'un token
  {
    console.log("Connexion autorisée");
    next(); // alors seulement on autorise la route
  }
  else {
    console.log("Connexion refusée");
    router.push('/');
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
    component: () => import('../views/LogIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    beforeEnter: clearLocalStorage,
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/home',
    name: 'HomePage',
    beforeEnter: tokenAccess, // route interdite si pas de token
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/publish',
    name: 'PublishPage',
    component: () => import('../views/PublishPost.vue')
  },
  {
    path: '/edit/:id',
    name: 'EditPost',
    component: () => import('../views/EditPost.vue')
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import('../views/ErrorPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
