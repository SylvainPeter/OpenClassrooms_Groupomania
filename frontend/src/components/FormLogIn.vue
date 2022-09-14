<template>
  <div class="form-container">
    <form class="form" action="/ma-page-de-traitement" method="post">
      <div>
        <label for="mail">Adresse email</label>
        <input type="email" id="email" name="user_mail" placeholder="Entrez votre adresse email">
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="user_password" placeholder="Entrez votre mot de passe">
      </div>
      <div class="error"></div> <!-- Message d'erreur -->
      <button type="submit" class="form__button">Se connecter</button>
      <br>
      <p>Pas encore inscrit ?</p>
      <button class="form__button--signup">
        <router-link id="signup-link" to="/signup">Créer un compte</router-link>
      </button>
    </form>
  </div>
</template>


<style lang='scss' scoped>
.form-container {
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
    color: #FFFFFF;
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
  color: #FFFFFF;
}
</style>