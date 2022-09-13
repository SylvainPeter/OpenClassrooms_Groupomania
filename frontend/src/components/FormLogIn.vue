<template>
  <div class="form-content">
    <form class="form" action="/ma-page-de-traitement" method="post">
      <div>
        <label htmlFor="mail">Adresse email
          <input type="email" id="email" name="user_mail" placeholder="Entrez votre adresse email">
        </label>
      </div>
      <div>
        <label htmlFor="password">Mot de passe
          <input type="password" id="password" name="user_password" placeholder="Entrez votre mot de passe">
        </label>
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
$color-primary : #FD2D01;
$color-secondary : #FFD7D7;
$color-tertiary : #4E5166;
$color-primary--darken : darken(#FD2D01, 4%);
$color-tertiary--darken : darken(#4E5166, 4%);

@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:wght@400;500&family=Shrikhand&display=swap');

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
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
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