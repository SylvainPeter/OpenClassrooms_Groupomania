<template>
  <div>
    <home-header></home-header>
    <div class="container">
      <div class="publish__post">
        <h1>Créer une publication</h1>
        <!-- Zone texte -->
        <textarea type="title" name="title" placeholder="Quoi de neuf ?" rows="10" maxlength="1000" v-model="text"
          @input="check" />
        <!-- Bouton pour ajouter une image -->
        <input type="file" id="add-file" name="image" @change="selectImage" />
      </div>
      <button id="form-validate-button" type="submit" :disabled="isDisabled" @click="createPost">Publier</button>
      <img class="image__preview" v-if="imageUrl" :src="imageUrl" />
    </div>
  </div>
</template>
  
<script>
import Axios from 'axios';
import HomeHeader from '../components/HomeHeader.vue';
import ls from 'localstorage-slim';
 
// enable global encryption
ls.config.encrypt = true;

export default {
  components: {
    'home-header': HomeHeader,
  },
  data() {
    return {
      pseudo: '',
      text: '',
      selectedFile: '',
      imageUrl: '',
      isDisabled: true,
    };
  },
  mounted() {
    this.getPseudo();
  },
  methods: {

    // RECUPERE LE PSEUDO
    getPseudo() { 
      // On récupère le pseudo depuis le localStorage
      const user = JSON.parse(ls.get('userData'));
      this.pseudo = user.pseudo;
    },

    // FICHIER IMAGE SELECTIONNE
    selectImage(event) {
      this.selectedFile = event.target.files[0];
      this.imageUrl = URL.createObjectURL(this.selectedFile);
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

    // ENVOIE UN NOUVEAU POST
    createPost() {
      // Récupère le token de l'utilisateur
      const user = JSON.parse(ls.get('userData'));
      const token = user.token;
      // Créé le header de la requête avec le token
      const header = { headers: { Authorization: 'Bearer ' + token } };
      // Récupère les données
      const newPostData = new FormData();
      newPostData.append('pseudo', user.pseudo);
      newPostData.append('userId', user.userId);
      newPostData.append('text', this.text);
      newPostData.append('image', this.selectedFile);
      // Envoie les données à l'API
      Axios
        .post('http://localhost:3000/api/posts/', newPostData, header)
        .then(() => {
          console.log("Post créé !");
          this.$router.push('/home');
        })
        .catch((error) => console.log(error));
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

.publish__post {
  display: flex;
  flex-direction: column;
  margin: 20px 10px;

  // Laptop
  @media screen and (min-width: 768px) {
    width: 50%;
  }

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    width: 90%;
  }
}

h1 {
  font-size: large;
}

textarea {
  margin: 20px 20px 10px 20px;
  padding: 10px;
  border-radius: 10px;
}

#add-file {
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

.image__preview {
  max-width: 300px;
}
</style>
  