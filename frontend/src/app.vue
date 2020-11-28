<template>
	<div id="app" :style="appStyle">
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
		},
		appStyle() {
			const page = this.$router.name;
			const isHome = (page === 'home' || page === 'login' || page === 'signup');
			return { 'padding-block-start': (isHome) ? '150px' : '100px' };
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