<template>
  <div class="form-content">
    <form class="form" method="post">
      <div>
        <label for="pseudo">Pseudo </label>
        <input type="text" id="pseudo" name="user_pseudo" placeholder="Entrez votre pseudo" v-model="pseudo">
      </div>
      <div>
        <label for="mail">Adresse email</label>
        <input type="email" id="email" name="user_mail" placeholder="Entrez votre adresse email" v-model="email">
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="user_password" placeholder="Entrez votre mot de passe"
          v-model="password">
      </div>
      <div v-show="error" class="error">{{ errorMsg }}</div>
      <button type="submit" class="form__button" @click.prevent="userSignUp()">Créer un compte</button>
      <br>
      <p>Déjà inscrit ?</p>
      <button class="form__button--login">
        <router-link id="login-link" to="/">Se connecter</router-link>
      </button>
    </form>
  </div>
</template>
  
<script>

import Axios from 'axios';

export default {
  data() {
    return {
      pseudo: '',
      email: '',
      password: '',
      error: false,
      errorMsg: '',
    };
  },
  methods: {
    userSignUp() {
      // si l'un des champs est vide, on affiche le message d'erreur
      if (this.pseudo === '' || this.email === '' || this.password === '') {
        this.error = true;
        this.errorMsg = 'Merci de compléter tous les champs !';
        // sinon, on n'affiche rien
      } else {
        this.error = false;
        this.errorMsg = '';

        Axios
          .post('http://localhost:3000/api/auth/signup', {
            // récupère et poste les entrées du formulaire
            pseudo: this.pseudo,
            email: this.email,
            password: this.password,
          })
          .then((res) => {
            console.log(res.data.message);
            this.$router.push('/'); // redirige vers la page de Login
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err.response.data.message);
          });
      }
    },
  },
};

/*
import { ref } from 'vue';
import Axios from 'axios';

const pseudo = ref('');
const email = ref('');
const password = ref('');
const error = ref(false);
const errorMsg = ref('');

function userSignUp() {
if (this.pseudo === '' || this.email === '' || this.password === '') {
  this.error = true; // Si l'un des champs est vide : erreur
  this.errorMsg = 'Merci de renseigner tous les champs.';
} else {
  this.error = false;
  this.errorMsg = '';

  Axios
    .post('http://localhost:3000/api/auth/signup', {
      pseudo: this.pseudo,
      email: this.email,
      password: this.password,
    }) // header entre l'accolade et la parenthèse
    .then((response) => {
      console.log(response.data.message);
      this.$router.push('/');
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.response.data.message);
    });
}
}
*/
</script>

<style lang='scss' scoped>
.form-content {
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  margin: 0 30px;

  @media screen and (min-width: 1025px) {
    width: 60%;
  }

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    width: 60%;
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #FFFFFF;
  border: 1px solid #FFFFFF;
  border-radius: 10px;

  div {
    display: flex;
    flex-direction: column;

    label {
      color: $color-primary;
      font-weight: 700;
      margin: 15px 0 5px 0;
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 8px;
      border-radius: 5px;
      border: 1px solid #9E9E9E;
    }
  }

  &__button {
    background: $color-primary;
    border: $color-primary;
    border-radius: 5px;
    padding: 10px;
    margin-top: 25px;
    text-decoration: none;
    font-size: 1.4em;
    font-weight: 700;
    color: #FFFFFF;
  }

  &__button:hover {
    cursor: pointer;
    background: $color-primary--darken;
  }

  &__button--login {
    background: $color-tertiary;
    border: $color-primary;
    border-radius: 5px;
    padding: 10px;
    margin: 0 50px 0 50px;
    text-decoration: none;
    font-size: 1em;
    font-weight: 700;

    &:hover {
      cursor: pointer;
      background: $color-tertiary--darken;
    }
  }
}

#login-link {
  text-decoration: none;
  color: #FFFFFF;
}
</style>
  