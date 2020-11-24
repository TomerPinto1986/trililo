<template>
	<section class="board-preview" :style="boardStyle" @click="goToBoard">
		<h2>{{ boardDetails.name }}</h2>
		<h2>{{ boardDetails }}</h2>
	</section>
</template>

<script>
export default {
	props: {
		boardDetails: Object
	},
	computed: {
		boardStyle() {
			return { background: this.boardDetails.style.background };
		}
	},
	methods: {
		goToBoard() {
			this.$router.push(`/board/${this.boardDetails._id}`);
		}
	}

}
</script>

