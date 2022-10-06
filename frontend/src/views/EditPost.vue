<template>
    <div>
        <home-header></home-header>
        <div class="container">
            <div id="edit__post">
                <h1>Modifier la publication</h1>
                <!-- Zone texte -->
                <textarea type="text" placeholder="Entrez le nouveau texte" rows="10" maxlength="1000"
                    v-model="editedText" />
                <!-- Bouton pour ajouter une image -->
                <input type="file" id="add-file" name="image" @change="selectImage" />
            </div>
            <button id="form-validate-button" @click="updatePost">Modifier</button>
            <img id="image__preview" v-if="imageUrl" :src="imageUrl" />
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Axios from 'axios';
import ls from 'localstorage-slim';
import HomeHeader from '../components/HomeHeader.vue';

// enable global encryption
ls.config.encrypt = true;


const router = useRouter();
const route = useRoute();
let editedText = ref('');
let imageUrl = ref('');
let userId = ref('');
let selectedFile = '';

// RECUPERE L'USERID
function getUserId() {
    const user = JSON.parse(ls.get('userData'));
    userId.value = user.userId;
}

// FICHIER SELECTIONNE
function selectImage(event) {
    selectedFile = event.target.files[0];
    imageUrl.value = URL.createObjectURL(selectedFile);
}

// RECUPERE LE POST
function getPostData() {
     // Créé le header de la requête avec le token
    const user = JSON.parse(ls.get('userData'));
    const header = { headers: { Authorization: 'Bearer ' + user.token } };
    // Envoie la requête à l'API
    Axios
        .get('http://localhost:3000/api/posts/' + route.params.id, header)
        .then((res) => {
            editedText.value = res.data.text;
            imageUrl.value = res.data.imageUrl;
        })
        .catch((err) => {
            console.log(err);
        });
}

// MODIFIE LE POST
function updatePost() {
    // Créé le header de la requête avec le token
    const user = JSON.parse(ls.get('userData'));
    const header = { headers: { Authorization: 'Bearer ' + user.token } };
    // Récupère les données du post
    const myForm = new FormData();
    myForm.append('text', editedText.value);
    myForm.append('image', selectedFile);
    // Envoie les données à l'API
    Axios
        .put('http://localhost:3000/api/posts/' + route.params.id, myForm, header)
        .then((res) => {
            console.log(res.data.message);
            // eslint-disable-next-line no-restricted-globals
            router.push('/home');
        })
        .catch((err) => {
            console.log(err);
        });
}

getUserId();
getPostData();

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

#edit__post {
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
    border: 0;
    border-radius: 5px;
    font-size: 1em;
    font-weight: 700;
    text-decoration: none;
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
  