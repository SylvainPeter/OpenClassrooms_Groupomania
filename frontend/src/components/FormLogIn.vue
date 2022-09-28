<template>
  <div class="form-container">
    <form class="form" method="post">
      <div>
        <label for="mail">Adresse email</label>
        <input type="email" id="email" name="user_mail" placeholder="Entrez votre adresse email" v-model="email"
          @input="checkEmailField()" required>
        <div v-show="checkEmail" class="alert">{{ checkEmailMsg }}</div>
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="user_password" placeholder="Entrez votre mot de passe"
          v-model="password" @input="checkPasswordField()" required>
        <div v-show="checkPassword" class="alert">{{ checkPasswordMsg }}</div>
      </div>
      <button type="submit" class="form__button" @click.prevent="userLogIn()">Se connecter</button>
      <br>
      <p>Pas encore inscrit ?</p>
      <button class="form__button--signup" @click="router.push('/signup')">Créer un compte</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Axios from 'axios';
import ls from 'localstorage-slim';

// enable global encryption
ls.config.encrypt = true;


const router = useRouter();
let email = ref('');
let password = ref('');
let checkEmail = ref(false);
let checkEmailMsg = ref('');
let checkPassword = ref(false);
let checkPasswordMsg = ref('');


// TESTE LE CHAMP EMAIL
function checkEmailField() {
  const emailField = document.querySelector("#email");
  const emailRegex = new RegExp("^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]{2,4})+$");

  if (emailField.value == '') { // si le champ est vide ou bien rempli, on n'affiche rien
    checkEmail.value = false;
  }
  else if (emailRegex.test(emailField.value)) {
    checkEmail.value = false;
  }
  else { // si le champ n'est pas bien rempli, on affiche un message d'erreur
    checkEmail.value = true;
    checkEmailMsg.value = "Format incorrect !";
  }
}

// TESTE LE CHAMP PASSWORD
function checkPasswordField() {
  const passwordField = document.querySelector("#password");
  const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,25}$");

  if (passwordField.value == '') { // si le champ est vide ou bien rempli, on n'affiche rien
    checkPassword.value = false;
  }
  else if (passwordRegex.test(passwordField.value)) {
    checkPassword.value = false;
  }
  else { // si le champ n'est pas bien rempli, on affiche un message d'erreur
    checkPassword.value = true;
    checkPasswordMsg.value = "Format incorrect !";
  }
}

// ENVOI DU FORMULAIRE POUR LA CONNEXION
function userLogIn() {
  // si l'un des champs est vide, on affiche le message d'erreur
  if (email.value === '' || password.value === '') {
    alert("Merci de compléter tous les champs !");
    // sinon, on n'affiche rien
  } else if (checkEmail.value === true || checkPassword.value === true) {
    alert("Merci d'entrer les données au format correct !");
  }
  else {
    // si tous les champs sont bien complétés, on envoie une requête Axios
    Axios
      .post('http://localhost:3000/api/auth/login', {
        // on récupère et on envoie les données du formulaire
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        // si la connexion est autorisée
        if (res.data.token) {
          const userInfos = {
            pseudo: res.data.pseudo,
            token: res.data.token,
            userId: res.data.userId,
            isAdmin: res.data.isAdmin,
          };
          // on stocke les infos de l'utilisateur dans le localStorage
          ls.set('userData', JSON.stringify(userInfos));
        }
        router.push('/home'); // on redirige vers la page Home
      })
      // si la connexion est refusée
      .catch((err) => {
        console.log(err);
        alert("Mauvais identifiants!");
      });
  }
}

</script>

<style lang='scss' scoped>
.form-container {
  background-color: $background-color;
  border-radius: 5px;
  padding: 20px;
  margin: 0 30px;

  // Laptop
  @media screen and (min-width: 768px) {
    width: 60%;
  }

  // Mobile et tablette
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: $background-color;
  border: 1px solid $background-color;
  border-radius: 10px;

  div {
    display: flex;
    flex-direction: column;

    label {
      display: flex;
      flex-direction: column;
      margin: 15px 0 5px 0;
      font-weight: 700;
      color: $color-primary;
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
    color: $background-color;
  }

  &__button:hover {
    cursor: pointer;
    background: $color-primary--darken;
  }

  &__button--signup {
    margin: 0 50px 0 50px;
    padding: 10px;
    font-size: 1em;
    font-weight: 700;
    text-decoration: none;
    border-radius: 5px;
    border: $color-primary;
    background: $color-tertiary;
    color: $background-color;

    &:hover {
      cursor: pointer;
      background: $color-tertiary--darken;
    }
  }
}

.alert {
  color: $background-color;
  background-color: $alert-color;
}
</style>