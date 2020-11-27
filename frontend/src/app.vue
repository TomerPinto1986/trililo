<template>
    <div id="app">
        <main-header :loggedinUser="loggedinUser" @logout="logout" />
        <router-view />
    </div>
</template>

<script>
import mainHeader from './cmps/main-header.cmp';

export default {
    computed: {
        loggedinUser() {
            return this.$store.getters.loggedinUser.username;
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
        }
    },
    created() {
        this.$store.dispatch('loadBoards');
    },
    components: {
        mainHeader
    }
};

</script>