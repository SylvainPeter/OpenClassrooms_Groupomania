<template>
  <div class="content">
    <home-header></home-header>
    <div class="container">
      <div class="edit__post">
        <h1> Créer une publication</h1>
        <!-- Zone texte -->
        <textarea type="title" id="title" name="title" placeholder="Quoi de neuf ?" v-model="text" rows="10"
          maxlength="1000" @input="check" />
        <!-- Bouton pour ajouter une image -->
        <input type="file" id="file" name="image" @change="onFileSelected" />
      </div>
      <button id="form-validate-button" @click="createPost" type="submit" :disabled="isDisabled">Publier</button>
      <img class="image__preview" v-if="url" :src="url" />
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
      url: '',
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
      const token = user.token;
      const header = { headers: { Authorization: 'Bearer ' + token } };
      const newPostData = new FormData();
      newPostData.append('pseudo', user.pseudo);
      newPostData.append('userId', user.userId);
      newPostData.append('text', this.text);
      newPostData.append('image', this.selectedFile);
      // Envoie les données à l'API
      Axios
        .post('http://localhost:3000/api/posts/', newPostData, header)
        .then(() => {
          console.log("Nouveau post créé !");
          this.$router.push('/home');
        })
        .catch((error) => console.log(error));
    },

    // FICHIER SELECTIONNE
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.url = URL.createObjectURL(this.selectedFile);
    },

    // CONTROLE DU TEXTE
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
.container {

  // Laptop
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

}

h1 {
  font-size: large;
}

.edit__post {
  display: flex;
  flex-direction: column;
  margin: 20px 10px;

  // Laptop
  @media screen and (min-width: 768px) {
    width: 50%;
  }

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    width: 50%;
  }



  textarea {
    margin: 20px 20px 10px 20px;
    border-radius: 10px;
    font-weight: 400;
    padding: 10px;
    text-align: left;
  }

  #add-file-button {
    width: 159px;
    height: 23px;
    margin: 10px 20px 20px 20px;
    background-color: $color-primary;
    border: $color-primary;
    color: $background-color;
  }
}

#file {
  padding: 12px 0 12px 21px;
}

#form-validate-button {
  margin: 0px 50px 32px 50px;
  padding: 10px;
  font-size: 1em;
  font-weight: 700;
  text-decoration: none;
  border-radius: 5px;
  border: 0;
  background: $color-tertiary;
  color: $background-color;

  &:hover {
    cursor: pointer;
    background: $color-tertiary--darken;
  }
  &:disabled {
    background: $color-tertiary--lighten;
  }
}

.selected-file-name {
  margin-bottom: 10px;
}

.image__preview {
  max-width: 300px;
}
</style>
  