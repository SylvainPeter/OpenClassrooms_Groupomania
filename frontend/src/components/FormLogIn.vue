<template>
  <div class="form-container">
    <form class="form" method="post">
      <div>
        <label for="mail">Adresse email</label>
        <input type="email" id="email" name="user_mail" placeholder="Entrez votre adresse email" v-model="email">
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="user_password" placeholder="Entrez votre mot de passe" v-model="password">
      </div>
      <div class="error"></div> <!-- Message d'erreur -->
      <button type="submit" class="form__button" @click.prevent="userLogIn()">Se connecter</button>
      <div v-show="error" class="error">{{ errorMsg }}</div>
      <br>
      <p>Pas encore inscrit ?</p>
      <button class="form__button--signup">
        <router-link id="signup-link" to="/signup">Créer un compte</router-link>
      </button>
    </form>
  </div>
</template>

<script>
  import Axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: false,
        errorMsg: '',
      };
    },
    methods: {
      userLogIn() {
        // si l'un des champs est vide, on affiche le message d'erreur
        if (this.email === '' || this.password === '') {
          this.error = true; // Si l'un des champs est vide : erreur
          this.errorMsg = 'Merci de compléter tous les champs !';
          // sinon, on n'affiche rien
        } else {
          this.error = false;
          this.errorMsg = '';

          Axios
            .post('http://localhost:3000/api/auth/login', {
              // récupère et poste les entrées du formulaire
              email: this.email,
              password: this.password,
            })
            .then((res) => {
              // si la connexion est autorisée
              if (res.data.token) {
                const userInfos = {
                  pseudo: res.data.pseudo,
                  token: res.data.token,
                  userId: res.data.userId,
                  isAdmin: res.data.isAdmin // ?
                };
                // on stocke les infos de l'utilisateur dans le localStorage
                localStorage.setItem('userData', JSON.stringify(userInfos));
                // On ajoute le rôle de l'User au Store Vuex ?
               // this.$store.dispatch('setRole', res.data.isAdmin);
              }
              this.$router.push('/home'); // redirige vers la page Home
            })
            // si la connexion est refusée
            .catch((err) => {
              console.log(err);
            });
        }
      },
    },
  };
  </script>

<style lang='scss' scoped>
.form-container {
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

#signup-link {
  text-decoration: none;
  color: $background-color;
}
</style>