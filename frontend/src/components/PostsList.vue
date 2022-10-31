<template>
  <main class="container">
    <!-- Posts -->
    <article v-for="post in posts" :key="post._id">
      <!-- Identité du user -->
      <header>
        <i class="lni lni-user user_icon"></i>
        <h2 id="pseudo">{{ post.pseudo }}</h2>
      </header>
      <section>
        <!-- Texte du post -->
        <p id="content" v-show="post.text">{{ post.text }}</p>
        <!-- Image du post -->
        <img v-if="post.imageUrl" id="image" :src="post.imageUrl" alt='image du post'>
        <!-- Icones en bas du post -->
      </section>
      <footer>
        <div id="footer--right-block">
          <!-- Likes -->
          <button title="Liker" @click="likePost(post)" :disabled="likeDisable(post)">
            <i class="lni lni-thumbs-up"></i>
          </button>
          <span>{{post.likes}}</span>
          <!-- Dislikes -->
          <button title="Disliker" @click="dislikePost(post)" :disabled="dislikeDisable(post)">
            <i class="lni lni-thumbs-down"></i>
          </button>
          <span>{{post.dislikes}}</span>
        </div>
        <!-- S'affiche seulement si le user est authentifié ou s'il est admin -->
        <div id="footer--left-block" v-if="userId == post.userId || isAdmin">
          <!-- Editer le post (en envoie en paramètre l'Id du post)-->
          <button title="Editer" tabindex="0" @click="$router.push({ name: 'EditPost', params: {id:post._id} })">
            <i class="lni lni-pencil-alt"></i>
          </button>
          <!-- Supprimer le post -->
          <button title="Supprimer" tabindex="0" @click="deletePost(post)">
            <i class="lni lni-trash-can"></i>
          </button>
        </div>
      </footer>
    </article>
  </main>
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

// GERE LE DISABLE DU CHAMP LIKE

function likeDisable(post) {
  // si le user a déjà disliké ce post, le champ like est disable
  if (post.usersDisliked.includes(userId)) { return true; }
  // si le user n'a pas encore disliké ce post ou que le dislike est à 0, le champ like est actif
  else if (!post.usersDisliked.includes(userId) || post.dislikes == 0) { return false; }
}

// GERE LE DISABLE DU CHAMP DISLIKE

function dislikeDisable(post) {
  // si le user a déjà liké ce post, le champ dislike est disable
  if (post.usersLiked.includes(userId)) { return true; }
  // si le user n'a pas encore disliké ce post ou que le like est à 0, le champ dislike est actif
  else if (!post.usersLiked.includes(userId) || post.likes == 0) { return false; }
}

// LIKER UN POST

function likePost(post) {
  // Créé le header de la requête avec le token
  const user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Si le user a déjà liké ce post, on annule le like
  if (post.usersLiked.includes(userId)) {
    const data = {
      like: 0,
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
  // Si le user n'a pas déjà liké ce post, on ajoute le like
  else {
    const data = {
      like: 1,
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
}

// DISLIKER UN POST

function dislikePost(post) {
  // Créé le header de la requête avec le token
  const user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Si le user a déjà disliké ce post, on annule le dislike
  if (post.usersDisliked.includes(userId)) {
    const data = {
      like: 0,
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
  // Si le user n'a pas déjà disliké ce post, on ajoute le dislike
  else {
    const data = {
      like: -1,
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
}

getLocalStorageData();
getAllPosts();

</script>

  
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/geometric.jpg");
}

article {
  margin: 20px 10px;
  border-radius: 10px;
  box-shadow: 11px 12px 8px rgba(0, 0, 0, 0.25);
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
  border-radius: 10px 10px 0 0;
  background-color: $color-primary;
  color: $background-color;
}

#pseudo {
  font-size: 1.1em;
  font-weight: 600;
}

#content {
  text-align: left;
  margin: 20px 0 15px 0;
  padding: 8px 10px;
  font-size: 1.06em;
  font-weight: 400;

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    font-size: 0.97em;
  }
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
  margin-left: 1px;
  width: 41px;
  font-size: 1.3em;
  font-weight: bold;
  border: none;
  background-color: $background-color;

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    font-size: 1.2em;
  }

  &:hover {
    color: $color-primary;
  }

  &[disabled]:hover {
    color: $color-tertiary--disabled;
  }
}

.user_icon {
  padding: 10px;
  width: 26px;
  font-size: 1.2em;
  font-weight: 1000;
}
</style>
  