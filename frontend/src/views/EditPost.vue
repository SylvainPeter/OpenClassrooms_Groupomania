<template>
    <div>
        <home-header></home-header>
        <div class="container">
            <div class="edit__post">
                <h1>Modifier la publication</h1>
                <!-- Zone texte -->
                <textarea type="text" placeholder="Entrez le nouveau texte" rows="10" maxlength="1000"
                    v-model="editedText" />
                <!-- Bouton pour ajouter une image -->
                <input type="file" id="add-file" name="image" @change="selectImage" />
            </div>
            <button id="form-validate-button" @click="updatePost">Modifier</button>
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
            userId: '',
            editedText: '',
            imageUrl: '',
            isAdmin: false,
        };
    },
    mounted() {
        this.getUserId();
        this.getPostData();
    },
    methods: {
        // RECUPERE L'USERID
        getUserId() {
            const user = JSON.parse(ls.get('userData'));
            this.userId = user.userId;
        },

        // FICHIER SELECTIONNE
        selectImage(event) {
            this.selectedFile = event.target.files[0];
            this.imageUrl = URL.createObjectURL(this.selectedFile);
        },

        // MODIFIE LE POST
        getPostData() {
            // Récupère le token de l'utilisateur
            const user = JSON.parse(ls.get('userData'));
            const token = user.token;
            // Créé le header de la requête avec le token
            const header = { headers: { Authorization: 'Bearer ' + token } };
            // Envoie les données à l'API
            Axios
                .get('http://localhost:3000/api/posts/' + this.$route.params.id, header)
                .then((res) => {
                    this.editedText = res.data.text;
                    this.imageUrl = res.data.imageUrl;
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        // MODIFIE LE POST
        updatePost() {
            // Récupère le token de l'utilisateur
            const user = JSON.parse(ls.get('userData'));
            const token = user.token;
            // Créé le header de la requête avec le token
            const header = { headers: { Authorization: 'Bearer ' + token } };
            // Récupère les données
            const myForm = new FormData();
            myForm.append('text', this.editedText);
            myForm.append('image', this.selectedFile);
            // Envoie les données à l'API
            Axios
                .put('http://localhost:3000/api/posts/' + this.$route.params.id, myForm, header)
                .then((res) => {
                    console.log(res.data.message);
                    // eslint-disable-next-line no-restricted-globals
                    this.$router.push('/home');
                })
                .catch((err) => {
                    console.log(err);
                });
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

.image__preview {
    max-width: 300px;
}
</style>
  