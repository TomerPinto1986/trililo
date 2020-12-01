<template>
	<div id="app" class="main-layout flex f-col" :style="appStyle">
		<main-header :loggedinUserId="loggedinUser" @logout="logout" />
		<div class="main-content flex f-col">
			<router-view />
		</div>
	</div>
</template>

<script>
import mainHeader from './cmps/main-header.cmp';
import { socketService } from './services/socket.service';

export default {
	computed: {
		loggedinUser() {
			return this.$store.getters.loggedinUser._id;
		},
		appStyle() {
			const page = this.$route.name;
			const isHome = (page === 'home' || page === 'login' || page === 'signup');
			return { 'background': (isHome) ? '#eeeeee' :  this.$store.getters.bgc };

		}
	},
	methods: {
		logout() {
			this.$store.dispatch('logout');
		}
	},
	created() {
		socketService.setup();
		this.$store.dispatch('loadBoards');
	},
	destroyed() {
		socketService.terminate();
	},
	components: {
		mainHeader
	}
};

</script>