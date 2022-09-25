<template>
    <div>
        <home-header></home-header>
        <div class="container">
            <div class="edit__post">
                <h1>Modifier la publication</h1>
                <!-- Zone texte -->
                <textarea type="text" placeholder="Entrez le nouveau texte" rows="10" v-model="editedText"
                    maxlength="1000" />
                <!-- Bouton pour ajouter une image -->
                <input type="file" id="add-file" name="image" @change="selectFile" ref="file" />
            </div>
            <button id="form-validate-button" @click="updatePost">Modifier</button>
            <img v-show="imageUrl" class="image__preview" :src="imageUrl" />
        </div>
    </div>
</template>
  
<script>
import Axios from 'axios';
import HomeHeader from '../components/HomeHeader.vue';

export default {
    name: 'EditPost',
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
    },
    methods: {
        // RECUPERE L'USERID
        getUserId() {
            const user = JSON.parse(localStorage.getItem('userData'));
            this.userId = user.userId;
        },

        // RECUPERE IMAGE
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imageUrl = URL.createObjectURL(this.file);
            console.log(this.imageUrl);
        },

        // MODIFIER LE POST
        updatePost() {
            // Récupère le token de l'utilisateur
            const user = JSON.parse(localStorage.getItem('userData'));
            const token = user.token;
            // Créé le header de la requête avec le token
            const header = { headers: { Authorization: 'Bearer ' + token } };
            // Récupère les données
            const myForm = new FormData();
            myForm.append('text', this.editedText);
            myForm.append('image', this.file);
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
        width: 50%;
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
  