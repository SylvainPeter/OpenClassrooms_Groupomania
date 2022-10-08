<template>
  <div class="container">
    <div id="groupomania-image">
      <img id="logo" src="../assets/icon-left-font-monochrome-white.png" alt="logo">
    </div>
    <div id="login">
      <img id="alt-logo" src="../assets/icon-left-font-monochrome-black.png" alt="logo">
      <h1>CONNEXION</h1>
      <form-log-in></form-log-in>
    </div>
  </div>
</template>

<script setup>
import FormLogIn from '../components/FormLogIn.vue';
</script>

<style lang="scss" scoped>
.container {
  @media screen and (min-width: 768px) {
    // Laptop
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  @media screen and (max-width: 768px) {
    // Mobile et tablette
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 86px;
  }
}

#groupomania-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-image: url("../assets/startup.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  filter: hue-rotate(20deg);

  @media screen and (max-width: 768px) {
    display: none;
  }
}

#logo {
  width: 54%;
  opacity: 0.9;
}

#login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 65%;
}

#alt-logo {
  @media screen and (min-width: 769px) {
    // Laptop
    display: none;
  }

  @media screen and (max-width: 768px) {
    // Mobile et tablette
    width: 12em;
    opacity: 0.8;
  }
}

h1 {
  color: $color-primary;
}

</style>