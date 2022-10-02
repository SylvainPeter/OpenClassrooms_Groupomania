<template>
  <div class="container">
    <!-- Posts -->
    <article v-for="post in posts" :key="post._id">
      <!-- Identité du user -->
      <header>
        <i class="lni lni-user icon"></i>
        <span id="pseudo">{{ post.pseudo }}</span>
      </header>
      <main>
        <!-- Texte du post -->
        <p id="content" v-show="post.text">{{ post.text }}</p>
        <!-- Image du post -->
        <img :src="post.imageUrl" alt='image du post' id="image" />
        <!-- Icones en bas du post -->
      </main>
      <footer>
        <div id="footer--right-block">
          <!-- Likes -->
          <button title="Liker" @click="likePost(post)" :disabled="likeDisabled">
            <i class="lni lni-thumbs-up"></i>
          </button>
          <span>{{post.likes}}</span>
          <!-- Dislikes -->
          <button title="Disliker" @click="dislikePost(post)" :disabled="dislikeDisabled">
            <i class="lni lni-thumbs-down"></i>
          </button>
          <span>{{post.dislikes}}</span>
        </div>
        <!-- S'affiche seulement si le user est authentifié ou s'il est admin -->
        <div id="footer--left-block" v-if="userId == post.userId || isAdmin">
          <!-- Editer le post (en envoie en paramètre l'Id du post)-->
          <i class="lni lni-pencil-alt icon link-style" title="Editer"
            @click="$router.push({ name: 'EditPost', params: {id:post._id} })"></i>
          <!-- Supprimer le post -->
          <i class="lni lni-trash-can icon" title="Supprimer" @click="deletePost(post)"></i>
        </div>
      </footer>
    </article>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import Axios from 'axios';
import ls from 'localstorage-slim';

// enable global encryption
ls.config.encrypt = true;

let userId = ref('');
let isAdmin = ref(false);
// Data de tous les posts
let posts = ref('');
// Disable des buttons
let likeDisabled = ref(false);
let dislikeDisabled = ref(false);

// RECUPERER LES DONNES STOCKEES DANS LE LOCALSTORAGE

function getLocalStorageData() {
  const user = JSON.parse(ls.get('userData'));
  // pseudo = user.pseudo;
  userId = user.userId;
  isAdmin = user.isAdmin;
}

// AFFICHER TOUS LES POSTS

function getAllPosts() {
  // Créé le header de la requête avec le token
  let user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Envoie la requête à l'API
  Axios
    .get('http://localhost:3000/api/posts/', header)
    .then((res) => {
      posts.value = res.data;
      user = JSON.stringify(res.data.userId);
    })
    .catch((err) => console.log(err));
}

// SUPPRIMER UN POST

function deletePost(post) {
    // Créé le header de la requête avec le token
  const user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Envoie la requête à l'API
  Axios
    .delete('http://localhost:3000/api/posts/' + post._id, header)
    .then(() => {
      console.log("Post supprimé !");
    })
    .then(() => {
      getAllPosts();
    })
    .catch((err) => {
      console.log("Erreur ! Impossible d'effacer ce post...");
      console.log(err);
    })
}

// LIKER UN POST

function likePost(post) {
   // Créé le header de la requête avec le token
  const user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Récupère le array usersLiked de ce post
  Axios
    .get('http://localhost:3000/api/posts/' + post._id, header)
    .then((res) => {
      // Si l'API indique que le user a déjà liké ce post
      if (res.data.usersLiked.includes(user.userId)) {
        dislikeDisabled.value = false;
        const data = {
          like: 0, // on annule le like
          userId: user.userId
        };
        Axios
          .post('http://localhost:3000/api/posts/' + post._id + '/like', data, header)
          .then(() => {
            console.log("Like mis à jour !")
            getAllPosts();
          })
          .catch((err) => console.log(err));
      }
      // Si l'API indique que le user n'a pas déjà liké ce post
      else if (!res.data.usersLiked.includes(user.userId)) {
        dislikeDisabled.value = true;
        const data = {
          like: 1, // on ajoute le like
          userId: user.userId
        };
        Axios
          .post('http://localhost:3000/api/posts/' + post._id + '/like', data, header)
          .then(() => {
            console.log("Like mis à jour !")
            getAllPosts();
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
}


// DISLIKER UN POST

function dislikePost(post) {
   // Créé le header de la requête avec le token
  const user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Récupère le array usersDisliked de ce post
  Axios
    .get('http://localhost:3000/api/posts/' + post._id, header)
    .then((res) => {
      // Si l'API indique que le user a déjà disliké ce post
      if (res.data.usersDisliked.includes(user.userId)) {
        likeDisabled.value = false;
        const data = {
          like: 0, // on annule le dislike
          userId: user.userId
        };
        Axios
          .post('http://localhost:3000/api/posts/' + post._id + '/like', data, header)
          .then(() => {
            console.log("Dislike mis à jour !")
            getAllPosts();
          })
          .catch((err) => console.log(err));
      }
      // Si l'API indique que le user n'a pas déjà disliké ce post
      else if (!res.data.usersDisliked.includes(user.userId)) {
        likeDisabled.value = true;
        const data = {
          like: -1, // on ajoute le dislike
          userId: user.userId
        };
        Axios
          .post('http://localhost:3000/api/posts/' + post._id + '/like', data, header)
          .then(() => {
            console.log("Dislike mis à jour !")
            getAllPosts();
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
}

getLocalStorageData();
getAllPosts();

</script>

  
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // background-color: lemonchiffon;
  // background-image: url("../assets/globe.png");
  // background-repeat: round;
}

article {
  margin: 20px 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: $background-color;

  // Laptop
  @media screen and (min-width: 768px) {
    width: 50%;
  }

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    width: 93%;
  }
}

header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

#pseudo {
  font-weight: 600;
}

#content {
  text-align: left;
  margin: 0;
  padding: 8px 10px;
}

#image {
  width: 90%;
  height: 200px;
  padding: 10px;
  border-radius: 23px;
  object-fit: cover;

  // Laptop
  @media screen and (min-width: 768px) {
    height: 350px;
  }

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    height: 250px;
  }
}

footer {
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
}

#footer--right-block {
  display: flex;
  align-items: center;
}

#footer--left-block {
  display: flex;
  align-items: baseline;
}

button {
  padding: 10px;
  width: 41px;
  font-size: 1.1em;
  font-weight: bold;
  border: none;
  background-color: $background-color;

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    font-size: 1em;
  }

  &:hover {
    color: $color-primary;
  }

  &[disabled]:hover {
    color: $color-tertiary--disabled;
  }
}

.icon {
  padding: 10px;
  width: 26px;
  font-weight: 1000;

  &:hover {
    color: $color-primary;
  }
}

.link-style {
  position: relative;
  left: 9px;
  color: $color-tertiary;
}
</style>
  