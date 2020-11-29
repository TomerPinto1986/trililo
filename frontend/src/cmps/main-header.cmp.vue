<template>
	<section class="main-header" :class="headerClass">
		<div class="main-nav flex" v-if="!isHome">
			<router-link to="/" exact>Home</router-link>
			<router-link to="/board" exact>Boards</router-link>
		</div>
		<div class="logo flex">
			<span @click="goToHome">Taskules</span>
		</div>
		<div class="user-area flex">
			<template v-if="isGuest">
				<router-link to="/login">Login</router-link> |
				<router-link to="/signup">Signup</router-link>
			</template>
			<button v-else @click="emitLogout">Logout</button>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		loggedinUserId: String,
	},
	data() {
		return {
			isHome: false
		}
	},
	computed: {
		isGuest() {
			return this.loggedinUserId === 'guest' ? true : false;
		},
		headerClass() {
			return { home: this.isHome, app: !this.isHome };
		}
	},
	methods: {
		emitLogout() {
			this.$emit('logout');
		},
		goToHome() {
			if (this.$route.name === 'home') return;
			this.$router.push('/');
		}
	},
	watch: {
		'$route.path'() {
			const page = this.$route.name;
			this.isHome = (page === 'home' || page === 'login' || page === 'signup');
		}
	},
	created() {
		const page = this.$route.name;
		this.isHome = (page === 'home' || page === 'login' || page === 'signup');
	}
};
</script>