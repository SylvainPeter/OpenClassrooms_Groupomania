<template>
    <div>
        <home-header></home-header>
        <div class="container">
            <h1>Modifier la publication</h1>
            <div class="edit">
                <section class="edit__main">
                    <!-- Zone texte -->
                    <textarea v-model="editedText" type="text" placeholder="Entrez le nouveau texte" rows="10" />
                    <!-- Bouton pour ajouter une image -->
                    <input type="file" id="add-file" name="image" @change="selectFile" ref="file" />
                </section>
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
    name: 'updatePost',
    components: {
        'home-header': HomeHeader,
    },
    // eslint-disable-next-line object-shorthand
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
        this.getIsAdmin(); // ???????
    },
    methods: {
        // RECUPERE L'USERID
        getUserId() {
            const user = JSON.parse(localStorage.getItem('userData'));
            this.userId = user.userId;
        },

        // RECUPERE ADMIN ????????
        getIsAdmin() {
            console.log('checkisAdmin in edit posts');
            return this.$store.getters.isAdmin;
        },

        // RECUPERE IMAGE
        selectFile() {
            // eslint-disable-next-line prefer-destructuring
            this.file = this.$refs.file.files[0];
            this.imageUrl = URL.createObjectURL(this.file);
            console.log(this.imageUrl);
        },

        // MODIFIER LE POST
        updatePost() {
            const user = JSON.parse(localStorage.getItem('userData'));
            const token = user.token;
            // eslint-disable-next-line prefer-template
            const header = { headers: { Authorization: 'Bearer ' + token } };
            const myForm = new FormData();
            myForm.append('text', this.editedText);
            myForm.append('image', this.file);

            console.log('what is this.file', this.file);

            Axios
                // eslint-disable-next-line prefer-template
                .put('http://localhost:3000/api/posts/' + this.$route.params.id, myForm, header)
                .then((response) => {
                    console.log('response to updatePost');
                    console.log(response.data.message);
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
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:wght@400;500&family=Shrikhand&display=swap');

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

.edit {

    // Laptop
    @media screen and (min-width: 768px) {
        width: 50%;
    }

    // Mobile et tablette
    @media screen and (max-width: 768px) {
        width: 50%;
    }

    &__main {
        padding: 15px 15px 0 15px;

        textarea {
            width: 90%;
            margin: 20px 20px 10px 20px;
            padding: 10px;
            border-radius: 10px;
            font-weight: 400;
            text-align: left;
        }
    }

    &__file {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 20px;

        p {
            text-align: left;
            font-size: 15px;
        }
    }
}

.image__preview {
    max-width: 300px;
}
</style>
  