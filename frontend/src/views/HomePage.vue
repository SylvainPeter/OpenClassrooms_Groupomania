<template>
  <div class="container">
    <home-header></home-header>
    <div class="header">
      <input type="text" placeholder="Que voulez-vous dire ?" @click="$router.push('/publish')">
    </div>
    <posts-list></posts-list>
  </div>
</template>
  
<script setup>
import HomeHeader from '../components/HomeHeader.vue';
import PostsList from '../components/PostsList.vue';
</script>
  
<style lang="scss" scoped>
.container {
  margin: 10px;
}

.header {
  display: flex;
  justify-content: center;
  margin: 20px 10px;
}

input {
  width: 300px;
  padding: 15px;
  font-size: 1em;
  border-radius: 50px;
  border: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: $home-background-color;
  color: $color-primary;

  &:hover {
    background-color: $home-background-color--darken;
  }
}
</style>
  