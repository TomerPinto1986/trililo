<template>
	<section class="activity-preview flex">
		<avatar class="avater" :size="35" :username="username"></avatar>
		<div class="info flex f-col">
			<h2 @click="openCard" class="flex f-center">
				{{ username }} {{ activity.txt }}
			</h2>
			<h3>{{ moment(activity.createdAt).fromNow() }}</h3>
		</div>
	</section>
</template>

<script>
import avatar from 'vue-avatar';

export default {

	props: {
		activity: Object
	},
	computed: {
		username() {
			return this.activity.byMember.username;
		},
		time() {
			return this.activity.createdAt
		}
	},
	methods: {
		openCard() {
			console.log(this.activity.card.url)
			if (this.activity.card) this.$router.push(this.activity.card.url)
		}
	},
	components: {
		avatar
	},
};
</script>