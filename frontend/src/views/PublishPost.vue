<template>
    <div class="content">
      <home-header></home-header>
      <div class="container">
        <h3>Ajouter une publication</h3>
      <div class="post">
        <div class="post__question"> Quoi de neuf, {{ pseudo }} ?</div>
        <textarea
          aria-label="titre de la publication"
          type="title"
          id="title"
          name="title"
          placeholder="Titre"
          v-model="text"
          maxlength="150"
          @input="check"
        />
        <input
          aria-label="Ajoutez votre image"
          ref="fileInput"
          style="display: none"
          type="file"
          name="image"
          @change="onFileSelected"
          accept="image/*"
        />
        <button id="add-file-button" @click="$refs.fileInput.click()">
          + Ajouter une image
        </button>
        <div class="selected-file-name">
          {{ selectedFile.name }}
        </div>
      </div>
      <div id="form-validate-button">
          <button
            class="form-validate-button"
            id="form-validate-button"
            @click="createPost"
            type="submit"
            :disabled="isDisabled">
            Publier
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Axios from 'axios';
  import HomeHeader from '../components/HomeHeader.vue';
  
  export default {
    name: 'createPost',
    components: {
      'home-header': HomeHeader,
    },
    data() {
      return {
        pseudo: '',
        text: '',
        selectedFile: '',
        isDisabled: true,
      };
    },
    mounted() {
      this.getPseudo();
    },
    methods: {
    
    // RECUPERE LE PSEUDO
      getPseudo() { // On récupère le pseudo depuis le localStorage
        const user = JSON.parse(localStorage.getItem('userData'));
        this.pseudo = user.pseudo;
      },

      // ENVOIE UN NOUVEAU POST
      createPost() {
        const user = JSON.parse(localStorage.getItem('userData'));
        const myForm = new FormData();
        const AccessToken = user.token;
        // eslint-disable-next-line prefer-template
        const header = { headers: { Authorization: 'Bearer ' + AccessToken } };
        myForm.append('pseudo', user.pseudo);
        myForm.append('userId', user.userId);
        myForm.append('text', this.text);
        myForm.append('image', this.selectedFile);
        Axios
          .post('http://localhost:3000/api/posts/', myForm, header)
          .then(() => {
            // eslint-disable-next-line no-restricted-globals
            this.$router.push('/home');
          })
          // eslint-disable-next-line no-console
          .catch((error) => console.log(error));
      },
      onFileSelected(event) {
        // eslint-disable-next-line prefer-destructuring
        this.selectedFile = event.target.files[0];
      },
      check() {
        if (this.text.length >= 1) {
          this.isDisabled = false;
        }
        if (this.text.length < 1) {
          this.isDisabled = true;
        }
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .container{
    @media screen and (min-width: 1025px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    @media screen and (min-width: 768px) and (max-width: 1024px){
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  
  h3{
    color: white;
    display: flex;
    align-items: flex-start;
    margin: 20px 10px;
    @media screen and (min-width: 1025px) {
      width: 50%;
    }
    @media screen and (min-width: 768px) and (max-width: 1024px){
      width: 50%;
    }
  }
  
  .post{
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    margin: 20px 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    @media screen and (min-width: 1025px) {
      width: 50%;
    }
    @media screen and (min-width: 768px) and (max-width: 1024px){
      width: 50%;
    }
    &__question{
      font-family: Lato, sans-serif;
      font-weight: 700;
      color: #FD2D01;
      margin-top: 10px;
    }
    textarea{
      margin: 20px 20px 10px 20px;
      border-radius: 10px;
      font-family: Lato, sans-serif;
      font-weight: 400;
      color: black;
      padding: 10px;
      text-align: left;
    }
    #add-file-button{
      width: 159px;
      height: 23px;
      margin: 10px 20px 20px 20px;
      color: white;
      background-color: #FD2D01;
      border: #FD2D01;
    }
  }
  
  button{
    font-family: Lato, Helvetica, Arial, sans-serif;
    font-weight: 800;
    border-radius: 5px;
    height: 30px;
    width: 100px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  
  .form-validate-button{
      margin: 10px;
      background-color: white;
      border: white;
      color: #FD2D01;
    }
  
  .selected-file-name{
    margin-bottom: 10px;
  }
  
  </style>
  