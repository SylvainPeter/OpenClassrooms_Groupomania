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
          <i class="lni lni-thumbs-up icon" title="Liker"></i>
          <span>{{post.likes}}</span>
          <!-- Dislikes -->
          <i class="lni lni-thumbs-down icon" title="Disliker"></i>
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
  
<script>
import Axios from 'axios';
import ls from 'localstorage-slim';
 
// enable global encryption
ls.config.encrypt = true;

export default {
  name: 'PostsList',
  data: function () {
    return {
      pseudo: '',
      userId: '',
      isAdmin: false,
      posts: '',
      post: '',
      likes: [],
      liked: null,
    };
  },
  mounted() {
    this.getStoreData();
    this.getAllPosts();
  },
  methods: {

    // RECUPERER LES DONNES STOCKEES DANS LE LOCALSTORAGE
    getStoreData() {
      const user = JSON.parse(ls.get('userData'));
      this.pseudo = user.pseudo;
      this.userId = user.userId;
      this.isAdmin = user.isAdmin;
    },

    // AFFICHER TOUS LES POSTS
    getAllPosts() {
      // Récupère le token de l'utilisateur
      const user = JSON.parse(ls.get('userData'));
      const token = user.token;
      // Créé le header de la requête avec le token
      const header = { headers: { Authorization: 'Bearer ' + token } };
      Axios
        .get('http://localhost:3000/api/posts/', header)
        .then((res) => {
          this.posts = res.data;
          this.user = JSON.stringify(res.data.userId);
        })
        .catch((err) => console.log(err));
    },

    // SUPPRIMER UN POST
    deletePost(post) {
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
          this.getAllPosts();
        })
        .catch((err) => {
          console.log("Erreur ! Impossible d'effacer ce post...");
          console.log(err);
        });
    },

    // VERIFIER SI L'USER A DEJA LIKE UN POST
    checkIfUsersLiked(post) {
      const user = JSON.parse(ls.get('userData'));
      console.log('post', post);
      console.log('user', user.userId);
      if (post.usersLiked.includes(user.userId)) {
        return false;
      }
      return true;
    },

    // LIKER UN POST
    likePost(post) {
      // Récupère le token de l'utilisateur
      const user = JSON.parse(ls.get('userData'));
      const token = user.token;
      // Créé le header de la requête avec le token
      const header = { headers: { Authorization: 'Bearer ' + token } };
      const data = {
        likes: true,
        userId: this.userId,
        post: post._id,
      };
      Axios
        .post('http://localhost:3000/api/posts/' + post._id + '/like', data, header)
        .then(() => {
          // res.json()
          this.getAllPosts();
        })
        // eslint-disable-next-line no-shadow
        // .then((data) => this.likes.push(data))
        .catch((error) => console.log(error));
      this.liked = true; // <- on indique à notre template que le user à liké ce post
    },
  },
};

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
  