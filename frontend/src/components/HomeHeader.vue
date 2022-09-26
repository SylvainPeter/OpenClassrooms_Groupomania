<template>
    <div>
        <header>
            <div id="header-content">
                <router-link to="/home">
                    <img src="../assets/icon-left-font.png" id="logo" alt="Logo Groupomania" title="Accueil">
                </router-link>
                <strong>Bonjour, {{ pseudo }} !</strong>
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
}

#header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    // Laptop
    @media screen and (min-width: 768px) {
        width: 90%;
    }

    // Mobile et tablette A MODIFIER
    @media screen and (max-width: 768px) {
        flex-direction: column;
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
    