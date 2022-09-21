<template>
  <div class="form-content">
    <form class="form" method="post">
      <div>
        <label for="pseudo">Pseudo </label>
        <input type="text" id="pseudo" name="user_pseudo" placeholder="Ex: jeandupont (caractères spéciaux interdits)"
          v-model="pseudo" @input="checkPseudoField()" required>
        <div v-show="checkPseudo" class="alert">{{ checkPseudoMsg }}</div>
      </div>

      <div>
        <label for="mail">Adresse email</label>
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
      <button class="form__button--login" @click="$router.push('/')">Se connecter</button>
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
      checkPseudo: false,
      checkPseudoMsg: '',
      checkEmail: false,
      checkEmailMsg: '',
      checkPassword: false,
      checkPasswordMsg: '',
    };
  },
  methods: {
    // TESTE LE CHAMP PSEUDO
    checkPseudoField() {
      const pseudoField = document.querySelector("#pseudo");
      const pseudoRegex = new RegExp("^[0-9a-zA-ZÀ-ÿ]*$");

      if (pseudoRegex.test(pseudoField.value)) { // si le champ est bien rempli, on n'affiche rien
        this.checkPseudo = false;
      }
      else { // si le champ n'est pas bien rempli, on affiche un message d'erreur
        this.checkPseudo = true;
        this.checkPseudoMsg = "Format incorrect !";
      }
    },
    // TESTE LE CHAMP EMAIL
    checkEmailField() {
      const emailField = document.querySelector("#email");
      const emailRegex = new RegExp("^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]{2,4})+$");

      if (emailField.value == '') { // si le champ est vide ou bien rempli, on n'affiche rien
        this.checkEmail = false;
      }
      else if (emailRegex.test(emailField.value)) {
        this.checkEmail = false;
      }
      else { // si le champ n'est pas bien rempli, on affiche un message d'erreur
        this.checkEmail = true;
        this.checkEmailMsg = "Format incorrect !";
      }
    },
    // TESTE LE CHAMP PASSWORD
    checkPasswordField() {
      const passwordField = document.querySelector("#password");
      const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,25}$");

      if (passwordField.value == '') { // si le champ est vide ou bien rempli, on n'affiche rien
        this.checkPassword = false;
      }
      else if (passwordRegex.test(passwordField.value)) {
        this.checkPassword = false;
      }
      else { // si le champ n'est pas bien rempli, on affiche un message d'erreur
        this.checkPassword = true;
        this.checkPasswordMsg = "Format incorrect !";
      }
    },
    // ENVOI DU FORMULAIRE POUR CREE UN NOUVEL UTILISATEUR
    userSignUp() {
      // si l'un des champs est vide, on affiche le message d'erreur
      if (this.pseudo === '' || this.email === '' || this.password === '') {
        alert("Merci de compléter tous les champs !");
        // sinon, on n'affiche rien
      } else if (this.checkPseudo === true || this.checkEmail === true || this.checkPassword === true) {
        alert("Merci d'entrer les données au format correct !");
      }
      else {
        // si tous les champs sont bien complétés, on envoie une requête Axios
        Axios.post('http://localhost:3000/api/auth/signup', {
          // on récupère et on envoie les données du formulaire
          pseudo: this.pseudo,
          email: this.email,
          password: this.password,
        })
          // en cas de succès
          .then((res) => {
            console.log(res.data.message);
            alert("Nouvel utilisateur créé avec succès !")
            this.$router.push('/'); // on redirige vers la page de Login
            // en cas d'erreur
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err.response.data.message);
          });
      }
    },
  },
};

</script>

<style lang='scss' scoped>
.form-content {
  background-color: $background-color;
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
  background: $background-color;
  border: 1px solid $background-color;
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
  color: $alert-color;
}
</style>
  