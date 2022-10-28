<template>
  <div>
    <home-header></home-header>
    <div class="container">
      <div id="publish__post">
        <h1>Créer une publication</h1>
        <!-- Zone texte -->
        <textarea id="message" placeholder="Quoi de neuf ?" rows="10" maxlength="1000" aria-labelledby="message"
          v-model="text" @input="check" />
        <!-- Bouton pour ajouter une image -->
        <input type="file" id="add-file" name="image" aria-labelledby="add-file" @change="selectImage" />
      </div>
      <button id="form-validate-button" type="submit" :disabled="isDisabled" @click="createPost">Publier</button>
      <img v-if="imageUrl" id="image__preview" :src="imageUrl" alt="preview de l'image" />
      <button v-if="imageUrl" id="trashcan" title="Supprimer l'image" tabindex="0" @click="deleteImage">
        <i class="lni lni-trash-can"></i>
      </button>
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
  // si une image est sélectionnée, on active le bouton Publier
  isDisabled.value = false;
}

// SUPPRIME L'IMAGE
function deleteImage() {
  imageUrl.value = '';
  selectedFile = null;
  // si on supprime l'image et qu'il n'y a pas de texte, on désactive le bouton Publier
  if (text.value.length < 1) { isDisabled.value = true; }
}

// CONTROLE DU TEXTE
function check() {
  // si le texte est supérieur ou égal à 1 caractère, on active le bouton Publier
  text.value.length >= 1 ? isDisabled.value = false : isDisabled.value = true;
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
  padding: 10px;
  border-radius: 10px;
  font-size: 1.2em;
  background-color: $color-primary;
  color: $background-color;
}

textarea {
  margin: 20px 2px 10px 2px;
  padding: 10px;
  border-radius: 10px;
}

#add-file {
  padding: 12px 0 12px 8px;
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

#trashcan {
  margin: 30px 0 40px 0;
  width: 41px;
  font-size: 1.3em;
  font-weight: 1000;
  border: none;
  background-color: $background-color;

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    font-size: 1.3em;
  }

  &:hover {
    color: $color-primary;
  }
}
</style>
  