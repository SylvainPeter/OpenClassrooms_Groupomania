<template>
    <div>
        <header>
            <div id="header-content">
                <router-link to="/home">
                    <img src="../assets/icon-left-font.png" id="logo" alt="Logo Groupomania">
                </router-link>
                <p>Bonjour, {{ pseudo }} !</p>
                <div id="logout" @click="Logout()">Déconnexion</div>
            </div>
        </header>
    </div>
</template>
    
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

let pseudo = ref('');
const router = useRouter();


function Logout() {
    localStorage.clear();
    router.push('/');
}

function getPseudo() { // On récupère le pseudo depuis le localStorage
    const user = JSON.parse(localStorage.getItem('userData'));
    pseudo = user.pseudo;
}

getPseudo();

</script>
    
<style lang="scss" scoped>
header {
    display: flex;
    justify-content: center;
    //    border-radius: 0px 0px 10px 10px;
    //    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    /* Ajouter media queries */
}

#header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    /* Largeur de la zone header */
    @media screen and (min-width: 1025px) {
        width: 90%;
    }

    @media screen and (min-width: 768px) and (max-width: 1024px) {
        width: 50%;
    }
}

#logo {
    width: 180px;
    margin: 10px;
}

#logout:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>
    