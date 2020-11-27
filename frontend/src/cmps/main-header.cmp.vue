<template>
<<<<<<< HEAD
    <section class="main-header">
        <template v-if="isGuest">
            <router-link to="/login">Login</router-link> |
            <router-link to="/signup">Signup</router-link>
        </template>
        <button v-else @click="emitLogout">Logout</button>
    </section>
=======
	<section class="main-header" :class="headerClass">
		<router-link to="/login">Login</router-link> |
		<router-link to="/signup">Signup</router-link>
	</section>
>>>>>>> 024c95ced93e27479cbfffbf353acd96643e1fc2
</template>

<script>
export default {
<<<<<<< HEAD
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
=======
	computed: {
		headerClass() {
			return {};
		}
	}
>>>>>>> 024c95ced93e27479cbfffbf353acd96643e1fc2
};
</script>