<template>
  <div>
    <home-header></home-header>
    <div class="header">
      <input type="text" placeholder="Que voulez-vous dire ?" @click="$router.push('/publish')">
    </div>
    <!-- Posts -->
  </div>
</template>
  
<script>
import HomeHeader from '../components/HomeHeader.vue';

export default {
  components: {
    'home-header': HomeHeader,
  }
};
</script>
  
<style lang="scss" scoped>
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
  