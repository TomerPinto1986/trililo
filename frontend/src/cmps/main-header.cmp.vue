<template>
	<section class="main-header" :class="headerClass">
		<router-link to="/login">Login</router-link> |
		<router-link to="/signup">Signup</router-link>
	</section>
</template>

<script>
export default {
	computed: {
		headerClass() {
			return {};
		}
	}
};
</script>