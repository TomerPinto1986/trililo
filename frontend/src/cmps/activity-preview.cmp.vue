<template>
	<section class="activity-preview flex">
		<avatar class="avater" :size="35" :username="username"></avatar>
		<div v-if="activity.txt" class="info flex f-col">
			<h2  class="flex wrap">
				{{ username }} <span @click="openCard">{{ activity.txt }} </span>
			</h2>
			<h3>{{ moment(activity.createdAt).fromNow() }}</h3>
		</div>
		<div v-if="activity.comment" class="info flex f-col">
			<h2  class="flex f-center">
				{{ username }} on <span @click="openCard">{{activity.card.title}}: {{ activity.comment }}</span> 
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
		},

	},
	methods: {
		openCard() {
			if (this.activity.card) this.$router.push(this.activity.card.url)
		}
	},
	components: {
		avatar
	},
};
</script>