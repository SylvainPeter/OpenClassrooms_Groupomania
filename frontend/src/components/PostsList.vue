<template>
  <div class="container">
    <!-- Post -->
    <article class="post" v-for="post in posts" :key="post._id">
      <!-- Identité du user -->
      <div class="post__header">
        <i class="lni lni-user icon"></i>
        <span class="post__pseudo">{{ post.userId }}</span>
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
          <!-- Editer le post -->
          <i class="lni lni-pencil-alt icon" title="Editer"></i>
          <!-- Supprimer le post -->
          <i class="lni lni-trash-can icon" title="Supprimer"></i>
        </div>
      </div>
    </article>
  </div>
</template>
  
<script>
import Axios from 'axios';
// import Vue from 'vue';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// eslint-disable-next-line object-curly-newline
// import { faPenToSquare, faTrash, faHeart, faCircleUser } from '@fortawesome/free-solid-svg-icons';

// library.add(faPenToSquare, faTrash);
// library.add(faHeart, faCircleUser);
// Vue.config.productionTip = false;

export default {
  name: 'PostsList',
  data: function () {
    return {
      userId: '',
      isAdmin: '',
      pseudo: '',
      posts: '',
      post: '',
      likes: [],
      liked: null,
    };
  },
  mounted() {
    this.getPseudo();
    this.getAllPosts();
    this.getUserId();
    //   this.getIsAdmin();
  },
  methods: {

    // RECUPERER LE PSEUDO
    getPseudo() {
      const user = JSON.parse(localStorage.getItem('userData'));
      this.pseudo = user.pseudo;
    },

    // RECUPERER L'USERID
    getUserId() {
      const user = JSON.parse(localStorage.getItem('userData'));
      this.userId = user.userId;
    },

    // RECUPERE LE ROLE ADMIN
    //   getIsAdmin() {
    //    this.isAdmin = this.$store.getters.isAdmin;
    //  },

    // AFFICHER TOUS LES POSTS
    getAllPosts() {
      const user = JSON.parse(localStorage.getItem('userData'));
      const AccessToken = user.token;
      const header = { headers: { Authorization: 'Bearer ' + AccessToken } };
      Axios
        .get('http://localhost:3000/api/posts/', header)
        .then((res) => {
          console.log('response', res);
          this.posts = res.data;
          this.user = JSON.stringify(res.data.userId);
        })
        .catch((error) => console.log(error));
    },

    // MODIFIER UN POST
    editPublication(post) {
      const user = JSON.parse(localStorage.getItem('userData'));
      const AccessToken = user.token;
      // eslint-disable-next-line prefer-template
      const header = { headers: { Authorization: 'Bearer ' + AccessToken } };
      Axios
        // eslint-disable-next-line prefer-template
        .get('http://localhost:3000/api/posts/' + post._id, header)
        .then((res) => {
          console.log('This is the res from get message/id');
          console.log(res);
          // eslint-disable-next-line  prefer-arrow-callback
          this.$router.push({ name: 'EditPage' }); // Redirection vers la page d'Accueil
        })
        // eslint-disable-next-line  prefer-arrow-callback
        .catch(function (error) {
          console.log(error);
        });
    },

    // SUPPRIMER UN POST
    deletePost(post) {
      const user = JSON.parse(localStorage.getItem('userData'));
      const AccessToken = user.token;
      // eslint-disable-next-line prefer-template
      const header = { headers: { Authorization: 'Bearer ' + AccessToken } };
      Axios
        // eslint-disable-next-line prefer-template
        .delete('http://localhost:3000/api/posts/' + post._id, header)
        .then((response) => {
          console.log('this is response from deletePost');
          console.log(response.data.post);
        })
        .then(() => {
          this.getAllPosts();
        })
        .catch((err) => {
          console.log('this is error from deletePost');
          console.log(err);
        });
    },

    // VERIFIER SI L'USER A DEJA LIKE UN POST
    checkIfUsersLiked(post) {
      const user = JSON.parse(localStorage.getItem('userData'));
      console.log('post', post);
      console.log('user', user.userId);
      if (post.usersLiked.includes(user.userId)) {
        return false;
      }
      return true;
    },

    // LIKER UN POST
    likePost(post) {
      const user = JSON.parse(localStorage.getItem('userData'));
      const AccessToken = user.token;
      // eslint-disable-next-line prefer-template
      const header = { headers: { Authorization: 'Bearer ' + AccessToken } };
      const data = {
        likes: true,
        userId: this.userId,
        post: post._id,
      };
      Axios
        // eslint-disable-next-line prefer-template
        .post('http://localhost:3000/api/posts/' + post._id + '/like', data, header)
        .then(() => {
          // res.json()
          this.getAllPosts();
        })
        // eslint-disable-next-line no-shadow
        // .then((data) => this.likes.push(data))
        .catch((error) => console.log(error));
      this.liked = true; // <- on indique à notre template que le user à liker ce post
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

  // Laptop
  @media screen and (min-width: 768px) {
    width: 50%;
  }

  // Mobile et tablette A MODIFIER !
  @media screen and (max-width: 768px) {
    width: 70%;
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
    color: red;
  }
}
</style>
  