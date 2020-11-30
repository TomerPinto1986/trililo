<template>
	<section class="activity-preview flex">
		<avatar class="avater" :size="35" :username="username"></avatar>
		<div v-if="activity.txt" class="info flex f-col">
			<h2  class="flex wrap">
				{{ username }} <pre> </pre> <span @click="emitOpenCard">{{ activity.txt }} </span>
			</h2>
			<h3>{{ moment(activity.createdAt).fromNow() }}</h3>
		</div>
		<div v-if="activity.comment" class="info flex f-col">
			<h2  class="flex f-center">
				{{ username }} on <span @click="emitOpenCard">{{activity.card.title}}: {{ activity.comment }}</span> 
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
		emitOpenCard() {
			this.$emit('openCard', this.activity.card.id)
		}
	},
	components: {
		avatar
	},
};
</script>