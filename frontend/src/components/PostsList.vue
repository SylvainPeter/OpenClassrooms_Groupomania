<template>
  <div class="container">
    <!-- Posts -->
    <article class="post" v-for="post in posts" :key="post._id">
      <!-- Identité du user -->
      <div class="post__header">
        <i class="lni lni-user icon"></i>
        <span class="post__pseudo">{{ post.pseudo }}</span>
      </div>
      <!-- Texte du post -->
      <p class="post__content" v-show="post.text">{{ post.text }}</p>
      <!-- Image du post -->
      <img :src="post.imageUrl" alt='image du post' class="post__image" />
      <!-- Icones en bas du post -->
      <div class="post__footer">
        <div class="post__footer--right-block">
          <!-- Likes -->
          <i class="lni lni-thumbs-up icon" title="Liker" @click="likePost(post)"></i>
          <span>{{post.likes}}</span>
          <!-- Dislikes -->
          <i class="lni lni-thumbs-down icon" title="Disliker" @click="dislikePost(post)"></i>
          <span>{{post.dislikes}}</span>
        </div>
        <!-- S'affiche seulement si le user est authentifié ou s'il est admin -->
        <div class="post__footer--left-block" v-if="userId == post.userId || isAdmin">
          <!-- Editer le post (en envoie en paramètre l'Id du post)-->
          <i class="lni lni-pencil-alt icon link-style" title="Editer"
            @click="$router.push({ name: 'EditPost', params: {id:post._id} })"></i>
          <!-- Supprimer le post -->
          <i class="lni lni-trash-can icon" title="Supprimer" @click="deletePost(post)"></i>
        </div>
      </div>
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
let posts = ref('');
let liked = ref(false);
let disliked = ref(false);
let likevalue = 1;
let dislikevalue = -1;

// RECUPERER LES DONNES STOCKEES DANS LE LOCALSTORAGE
function getLocalStorageData() {
  const user = JSON.parse(ls.get('userData'));
  // pseudo = user.pseudo;
  userId = user.userId;
  isAdmin = user.isAdmin;
}

// AFFICHER TOUS LES POSTS
function getAllPosts() {
  // Récupère le token de l'utilisateur
  let user = JSON.parse(ls.get('userData'));
  const token = user.token;
  // Créé le header de la requête avec le token
  const header = { headers: { Authorization: 'Bearer ' + token } };
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
  // Récupère le token de l'utilisateur
  const user = JSON.parse(ls.get('userData'));
  const token = user.token;
  // Créé le header de la requête avec le token
  const header = { headers: { Authorization: 'Bearer ' + token } };
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
  // Récupère le token de l'utilisateur
  const user = JSON.parse(ls.get('userData'));
  const token = user.token;
  // Créé le header de la requête avec le token
  const header = { headers: { Authorization: 'Bearer ' + token } };
  // Détermine la valeur du like envoyé à l'API
  if (liked.value === false) {
    likevalue = 1;
    console.log(likevalue);
    console.log("Value is false");
  }
  else if (liked.value === true) {
    likevalue = 0;
    console.log(likevalue);
    console.log("Value is true");
  }
  const likeData = {
    like: likevalue,
    userId: user.userId
  };
  Axios
    .post('http://localhost:3000/api/posts/' + post._id + '/like', likeData, header)
    .then(() => {
      console.log("Like ajouté !")
      liked.value = true;
            // Indique au template que le post a été liké
      console.log(liked.value);
      getAllPosts();
    })
    .catch((err) => console.log(err));
}

// DISLIKER UN POST
function dislikePost(post) {
  // Récupère le token de l'utilisateur
  const user = JSON.parse(ls.get('userData'));
  const token = user.token;
  // Créé le header de la requête avec le token
  const header = { headers: { Authorization: 'Bearer ' + token } };
// Détermine la valeur du dislike envoyé à l'API
  if (disliked.value === false) {
    dislikevalue = -1;
    console.log(likevalue);
    console.log("Value is false");
  }
  else if (disliked.value === true) {
    dislikevalue = 0;
    console.log(likevalue);
    console.log("Value is true");
  }
  const dislikeData = {
    like: dislikevalue,
    userId: user.userId
  };
  Axios
    .post('http://localhost:3000/api/posts/' + post._id + '/like', dislikeData, header)
    .then(() => {
      console.log("Disike ajouté !")
      // Indique au template que le post a été disliké
      disliked.value = true;
      console.log(disliked.value);
      getAllPosts();
    })
    .catch((err) => console.log(err));
}

getLocalStorageData();
getAllPosts();

</script>

  
<style lang="scss" scoped>
.container {
  @media screen and (min-width: 768px) {
    // Laptop
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // background-color: lemonchiffon;
    // background-image: url("../assets/globe.png");
    // background-repeat: round;
  }

  @media screen and (max-width: 768px) {
    // A MODIFIER !
    // Mobile et tablette
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

.post {
  margin: 20px 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: $background-color;

  // Laptop
  @media screen and (min-width: 768px) {
    width: 50%;
  }

  // Mobile et tablette A MODIFIER !
  @media screen and (max-width: 768px) {
    width: 93%;
  }

  &__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__pseudo {
    font-weight: 600;
  }

  &__content {
    text-align: left;
    margin: 0;
    padding: 8px 10px;
  }

  &__image {
    width: 90%;
    height: 200px;
    padding: 10px;
    border-radius: 23px;
    object-fit: cover;

    // Laptop
    @media screen and (min-width: 768px) {
      height: 350px;
    }

    // Mobile et tablette A MODIFIER !
    @media screen and (max-width: 768px) {
      height: 250px;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
  }

  &__footer--right-block {
    display: flex;
    align-items: center;
  }

  &__footer--left-block {
    display: flex;
    align-items: baseline;
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
  top: -2px;
  left: 9px;
  color: $color-tertiary;
}
</style>
  