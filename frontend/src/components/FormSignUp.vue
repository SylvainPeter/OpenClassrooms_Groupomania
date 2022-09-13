<template>
  <div class="form-content">
    <form class="form" action="/ma-page-de-traitement" method="post">
      <div>
        <!-- ? -->
        <label htmlFor="pseudo">Pseudo
          <input type="text" id="pseudo" name="user_pseudo" placeholder="Entrez votre pseudo">
        </label>
      </div>
      <div>
        <!-- ? -->
        <label htmlFor="mail">Adresse email</label>
        <input type="email" id="email" name="user_mail" placeholder="Entrez votre adresse email">
      </div>
      <div>
        <!-- ? -->
        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" name="user_password" placeholder="Entrez votre mot de passe">
      </div>
      <div class="error"></div> <!-- Message d'erreur -->
      <button type="submit" class="form__button">Créer un compte</button>
      <br>
      <p>Déjà inscrit ?</p>
      <button class="form__button--login">
        <router-link id="login-link" to="/">Se connecter</router-link>
      </button>
    </form>
  </div>
</template>
  
  
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
      margin-bottom: 8px;
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
  