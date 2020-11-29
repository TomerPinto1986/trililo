<template>
	<div id="app" :style="appStyle">
		
		<main-header :loggedinUserId="loggedinUser" @logout="logout" />
		<router-view />
	</div>
</template>

<script>
import mainHeader from './cmps/main-header.cmp';

export default {
	computed: {
		loggedinUser() {
			return this.$store.getters.loggedinUser._id;
		},
		appStyle() {
			const page = this.$route.name;
			const isHome = (page === 'home' || page === 'login' || page === 'signup');
			return { 'padding-block-start': (isHome) ? '150px' : '0' };
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