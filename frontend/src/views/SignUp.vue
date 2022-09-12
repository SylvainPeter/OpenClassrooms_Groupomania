<template>
  <div class="content">
    <div class="jumbotron">
      <img class="logo" src="../assets/icon-left-font-monochrome-white.png" alt="logo" />
    </div>
    <div class="connexion">
      <h1>INSCRIPTION</h1>
      <form-sign-up></form-sign-up>
    </div>
  </div>
</template>
<script>
// Components
import FormSignUp from '../components/FormSignUp.vue';

export default {
  name: 'SignUp',
  components: {
    'form-sign-up': FormSignUp,
  }
};
</script>

<style lang="scss" scoped>
$color-primary : #FD2D01;

.content {
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 86px;
  }
}

.jumbotron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96vh;
  background-image: url("../assets/startup.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  filter: hue-rotate(20deg);

  @media screen and (max-width: 768px) {
    display: none;
  }
}

.connexion {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 65%;
}

.logo {
  width: 54%;
  opacity: 0.9;
}

h1 {
  color: $color-primary;
}
</style>
