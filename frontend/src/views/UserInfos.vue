<template>
    <div>
        <home-header></home-header>
        <div class="container">
        <div id="user">
            <h1><i class="lni lni-user user_icon"></i>Infos Utilisateur</h1>
            <p>Votre ID : {{userId}}</p>
            <p>Votre pseudo : {{pseudo}}</p>
            <p>Votre adresse email : {{email}}</p>
            <p v-if="isAdmin == true" >Vous êtes administrateur !</p>
            <p v-else>Vous n'êtes pas administrateur</p>
        </div>
    </div>
    </div>
</template>
    
<script setup>
import HomeHeader from '../components/HomeHeader.vue';
import { ref } from 'vue'
import ls from 'localstorage-slim';

// enable global encryption
ls.config.encrypt = true;

let userId = ref('');
let pseudo = ref('');
let email = ref('');
let isAdmin = ref('');


// RECUPERER LES DONNES STOCKEES DANS LE LOCALSTORAGE

function getLocalStorageData() {
    const user = JSON.parse(ls.get('userData'));
    // pseudo = user.pseudo;
    userId = user.userId;
    email = user.email;
    pseudo = user.pseudo;
    isAdmin = user.isAdmin;
}

getLocalStorageData()
</script>

<style lang="scss" scoped>


.container {

// Laptop
@media screen and (min-width: 768px) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Mobile et tablette
@media screen and (max-width: 768px) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

}

#user {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 20px 10px;

    // Laptop
    @media screen and (min-width: 768px) {
        width: 90%;
    }

    // Mobile et tablette
    @media screen and (max-width: 768px) {
        width: 90%;
    }
}

h1 {
    padding: 10px;
    border-radius: 10px;
    font-size: large;
    background-color: $color-primary;
    color: $background-color;
}

p {
    font-size: 1.3em;

        // Mobile et tablette
        @media screen and (max-width: 768px) {
        font-size: 1.1em;
    }

}
.user_icon {
  padding: 10px;
  width: 26px;
  font-size: 1.2em;
  font-weight: 1000;
}

</style>