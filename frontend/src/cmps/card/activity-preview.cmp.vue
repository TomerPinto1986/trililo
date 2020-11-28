<template>
	<section class="activity-preview">
		<avatar :username="username"></avatar>
		<h2>{{ username }} {{ activity.txt }}</h2>
	</section>
</template>

<script>
import avatar from 'vue-avatar';

export default {
	computed: {
		username() {
			return this.activity.byMember.username;
		}
	},
	props: {
		activity: Object
	},
	components: {
		avatar
	},
};
</script>