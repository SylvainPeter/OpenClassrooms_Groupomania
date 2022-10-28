<template>
    <div>
        <header>
            <div id="header-content">
                <h1>
                    <router-link to="/home">
                        <img src="../assets/icon-left-font.png" id="logo" title="Accueil" alt="logo groupomania">
                    </router-link>
                </h1>
                <strong>Bonjour,
                    <router-link to="/user" id="user" title="Infos utilisateur">{{ pseudo }}</router-link> !
                </strong>
                <div id="logout" tabindex="0" @click="Logout()">Déconnexion</div>
            </div>
        </header>
    </div>
</template>
    
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ls from 'localstorage-slim';

// enable global encryption
ls.config.encrypt = true;

let pseudo = ref('');
const router = useRouter();

function Logout() {
    localStorage.clear();
    router.push('/');
}

function getPseudo() {
    // On récupère le pseudo depuis le localStorage
    const user = JSON.parse(ls.get('userData'));
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

    // Mobile et tablette
    @media screen and (max-width: 768px) {
        flex-direction: column;
    }
}

#logo {
    width: 180px;
    margin: 10px;
}

#user {
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

#logout {

    // Mobile et tablette
    @media screen and (max-width: 768px) {
        margin: 33px 0 17px 0;
    }

    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
}
</style>
    