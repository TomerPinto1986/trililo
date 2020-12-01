<template>
	<section class="activity-preview flex f-col">
		<div class="avatar">
			<custom-avatar :size="30" :username="username" :src="activity.byMember.imgUrl" />
		</div>
		<div class="desc">
			<template v-if="activity.txt">
				<span class="user" >{{ username }} </span>
				<span class="activity">{{ activity.txt }} </span>
				<span v-if="activity.card" class="card" @click="emitOpenCard">{{
					activity.card.title
				}}</span>
			</template>
			<template v-else>
				<span class="user">{{ username }}</span>
				on
				<span class="activity"
					><span class="card" @click="emitOpenCard">{{ activity.card.title }}</span
					>: {{ activity.comment }}</span
				>
			</template>
		</div>
		<span class="time">
			{{ moment(activity.createdAt).fromNow() }}
		</span>
	</section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'

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
		emitOpenCard() {
			this.$emit('openCard', this.activity.card.id)
		},
		print(a,b){
			console.log(a,b)
		}
	},
	components: {
		// avatar,
		customAvatar
	},
};
</script>