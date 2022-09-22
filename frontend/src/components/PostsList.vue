<template>
    <div class="container">
      <article class="card" v-for="post in posts" :key="post._id">
        <header class="card__header">
          <p class="card__pseudo">
            {{ post.pseudo }}
          </p>
        </header>
        <p class="card__content" v-show="post.text">{{ post.text }}</p>
        <img :src="post.imageUrl" alt= 'image publiée' class= "card__image"/>
        <footer class="card__footer">
          <div class="card__footer--right">
            <button class="heart-button">
              <span
              v-if="checkIfUsersLiked(post)"
              @click="likePost(post)" class="card__icon3">COEUR</span>
            </button>
            <span>{{post.likes}} likes</span>
          </div>
          <!-- Si l'utilisateur est admin ou si le userId correspond à l'UserId
          de la publication alors on affiche l'icone modifier 
          <div class="icons" v-if="userId == post.userId || isAdmin">
            <router-link :to="{name:'EditPost', params: {id:post._id} }">PEN </router-link>
<span @click="deletePost(post)">POUBELLE</span>      
          </div>-->
        </footer>
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
    // eslint-disable-next-line object-shorthand
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
        // eslint-disable-next-line prefer-template
        const header = { headers: { Authorization: 'Bearer ' + AccessToken } };
        // eslint-disable-next-line  prefer-template
        Axios
          .get('http://localhost:3000/api/posts/', header)
          .then((response) => {
            console.log('response', response);
            this.posts = response.data;
            this.user = JSON.stringify(response.data.userId);
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
 
  .container{
     @media screen and (min-width: 1025px) {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    @media screen and (min-width: 768px) and (max-width: 1024px){
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
  
  .card{
    background-color: white;
    color: black;
    border-radius: 10px;
    font-family: Lato, sans-serif;
    margin: 20px 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
     @media screen and (min-width: 1025px) {
      width: 50%;
    }
    @media screen and (min-width: 768px) and (max-width: 1024px){
      width: 50%;
    }
    &__header{
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    &__pseudo{
      display: flex;
      align-items: center;
      padding: 10px 10px 0 10px;
      font-weight: 600;
      margin: 0;
    }
    &__content{
      font-weight: 400;
      color: black;
      margin: 0;
      padding: 8px 10px;
      display: flex;
      text-align: left;
    }
    &__image{
      padding: 10px;
      object-fit: cover;
      object-position: center;
      width: 95%;
      height: 200px;
      border-radius: 30px;
      @media screen and (min-width: 1025px) {
        height: 350px;
      }
      @media screen and (min-width: 768px) and (max-width: 1024px){
        height: 350px;
      }
    }
    &__footer{
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
    }
    &__footer--right{
      display: flex;
      align-items: center;
    }
    .icons{
      display: flex;
    }
    .heart{
      margin-bottom: 10px;
    }
  }
  
  .link{
    span{
      display: none;
    }
  }
  
  .card__icon0{
    margin-right: 5px;
  }
  
  .card__icon1{
    height: 20px;
    padding: 10px 5px 0 10px;
    color: black;
  }
  
  .card__icon2{
    height: 20px;
    padding: 10px 10px 0 5px;
    color: black;
  }
  
  .card__icon3{
    height: 20px;
    padding: 10px;
    color: black;
  }
  
  .heart-button{
    background-color: white;
    border: white;
    border-radius: 10px;
  }
  
  .heart-button:focus{
    .card__icon3{
      color: #FD2D01;
    }
  }
  
  .like__button{
    display: flex;
    align-items: center;
  }
  </style>
  