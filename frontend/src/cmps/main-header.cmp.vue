<template>
    <section class="main-header">
        <template v-if="isGuest">
            <router-link to="/login">Login</router-link> |
            <router-link to="/signup">Signup</router-link>
        </template>
        <button v-else @click="emitLogout">Logout</button>
    </section>
</template>

<script>
export default {
    props: {
        loggedinUser: String
    },
    computed: {
        isGuest() {
            return this.loggedinUser.includes('Guest') ? true : false;
        }
    },
    methods: {
        emitLogout() {
            this.$emit('logout');
        }
    }
};
</script>