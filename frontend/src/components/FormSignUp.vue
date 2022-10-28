<template>
  <main class="form-content">
    <form class="form" method="post">
      <div>
        <label for="pseudo">Pseudo </label>
        <input type="text" id="pseudo" name="user_pseudo" placeholder="Ex: jeandupont (caractères spéciaux interdits)"
          v-model="pseudo" @input="checkPseudoField()" required>
        <div v-show="checkPseudo" class="alert">{{ checkPseudoMsg }}</div>
      </div>
      <div>
        <label for="email">Adresse email</label>
        <input type="email" id="email" name="user_mail" placeholder="Ex: jean.dupont@gmail.com" v-model="email"
          @input="checkEmailField()" required>
        <div v-show="checkEmail" class="alert">{{ checkEmailMsg }}</div>
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="user_password"
          placeholder="Contient au moins 1 Maj, 1 minuscule et 1 chiffre" v-model="password"
          @input="checkPasswordField()" required>
        <div v-show="checkPassword" class="alert">{{ checkPasswordMsg }}</div>
      </div>
      <button type="submit" class="form__button" @click.prevent="userSignUp()">Créer un compte</button>
      <br>
      <p>Déjà inscrit ?</p>
      <button class="form__button--login" @click="router.push('/')">Se connecter</button>
    </form>
  </main>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Axios from 'axios';

const router = useRouter();
let pseudo = ref('');
let email = ref('');
let password = ref('');
let checkPseudo = ref(false);
let checkPseudoMsg = ref('');
let checkEmail = ref(false);
let checkEmailMsg = ref('');
let checkPassword = ref(false);
let checkPasswordMsg = ref('');

// TESTE LE CHAMP PSEUDO
function checkPseudoField() {
  const pseudoField = document.querySelector("#pseudo");
  const pseudoRegex = new RegExp("^[0-9a-zA-ZÀ-ÿ]*$");

  if (pseudoRegex.test(pseudoField.value)) { // si le champ est bien rempli, on n'affiche rien
    checkPseudo.value = false;
  }
  else { // si le champ n'est pas bien rempli, on affiche un message d'erreur
    checkPseudo.value = true;
    checkPseudoMsg.value = "Format incorrect !";
  }
}

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

// ENVOI DU FORMULAIRE POUR CREE UN NOUVEL UTILISATEUR
function userSignUp() {
  // si l'un des champs est vide, on affiche le message d'erreur
  if (pseudo.value === '' || email.value === '' || password.value === '') {
    alert("Merci de compléter tous les champs !");
    // sinon, on n'affiche rien
  } else if (checkPseudo.value === true || checkEmail.value === true || checkPassword.value === true) {
    alert("Merci d'entrer les données au format correct !");
  }
  else {
    // si tous les champs sont bien complétés, on envoie une requête Axios
    Axios.post('http://localhost:3000/api/auth/signup', {
      // on récupère et on envoie les données du formulaire
      pseudo: pseudo.value,
      email: email.value,
      password: password.value,
    })
      // en cas de succès
      .then((res) => {
        console.log(res.data.message);
        alert("Nouvel utilisateur créé avec succès !")
        router.push('/'); // on redirige vers la page de Login
        // en cas d'erreur
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err.response.data.message);
      });
  }
}



</script>

<style lang='scss' scoped>
.form-content {
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
      font-size: 1.17em;
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

  &__button--login {
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

#login-link {
  text-decoration: none;
  color: $background-color;
}

.alert {
  font-size:1.1em;
  color: $background-color;
  background-color: $alert-color;
}
</style>
  