<template>
  <div class="container">
    <home-header></home-header>
    <div id="publish">
      <button type="button" @click="$router.push('/publish')">Que voulez-vous dire ?</button>
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

#publish {
  display: flex;
  justify-content: center;
  margin: 20px 10px;
}

button {
  width: 300px;
  padding: 15px;
  font-size: 1em;
  border-radius: 50px;
  border: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: $background-color--darken;
  color: $color-tertiary;
  cursor: text;

  &:hover {
    background-color: $background-color--more-darken;
  }
}
</style>
  