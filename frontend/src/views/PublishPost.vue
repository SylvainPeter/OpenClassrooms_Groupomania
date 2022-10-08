<template>
  <div>
    <home-header></home-header>
    <div class="container">
      <div id="publish__post">
        <h1>Créer une publication</h1>
        <!-- Zone texte -->
        <textarea name="title" placeholder="Quoi de neuf ?" rows="10" maxlength="1000" v-model="text"
          @input="check" />
        <!-- Bouton pour ajouter une image -->
        <input type="file" id="add-file" name="image" @change="selectImage" />
      </div>
      <button id="form-validate-button" type="submit" :disabled="isDisabled" @click="createPost">Publier</button>
      <img id="image__preview" v-if="imageUrl" :src="imageUrl" />
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Axios from 'axios';
import ls from 'localstorage-slim';
import HomeHeader from '../components/HomeHeader.vue';

// enable global encryption
ls.config.encrypt = true;

const router = useRouter();
let pseudo = ref('');
let text = ref('');
let imageUrl = ref('');
let isDisabled = ref(true);
let selectedFile = null;

// RECUPERE LE PSEUDO
function getPseudo() {
  // On récupère le pseudo depuis le localStorage
  const user = JSON.parse(ls.get('userData'));
  pseudo.value = user.pseudo;
}

// FICHIER IMAGE SELECTIONNE
function selectImage(event) {
  selectedFile = event.target.files[0];
  imageUrl.value = URL.createObjectURL(selectedFile);
}

// CONTROLE DU TEXTE
function check() {
  if (text.value.length >= 1) {
    isDisabled.value = false;
  }
  if (text.value.length < 1) {
    isDisabled.value = true;
  }
}

// ENVOIE UN NOUVEAU POST
function createPost() {
  // Créé le header de la requête avec le token
  const user = JSON.parse(ls.get('userData'));
  const header = { headers: { Authorization: 'Bearer ' + user.token } };
  // Récupère les données du post
  const newPostData = new FormData();
  newPostData.append('pseudo', user.pseudo);
  newPostData.append('userId', user.userId);
  newPostData.append('text', text.value);
  newPostData.append('image', selectedFile);
  console.log(selectedFile);
  // Envoie les données à l'API
  Axios
    .post('http://localhost:3000/api/posts/', newPostData, header)
    .then(() => {
      console.log("Post créé !");
      router.push('/home');
    })
    .catch((error) => console.log(error));
}

getPseudo();

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

#publish__post {
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

#image__preview {
  max-width: 300px;
}
</style>
  