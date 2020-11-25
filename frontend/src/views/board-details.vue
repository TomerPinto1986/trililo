<template>
	<section class="board-details flex">
		<!-- <board-header :board="board"> -->
		<template v-if="board">
			<div v-for="group in board.groups" :key="group.id">
				<group :group="group" :isDetails="isDetails" @close="closeDetails" />
			</div>
		</template>
	</section>
</template>

<script>
import { boardService } from '../services/board.service.js';
import group from '../cmps/board/group.cmp';

export default {
	data() {
		return {
			board: null,
			isDetails: false
		}
	},
	components: {
		group
	},
	methods: {
		closeDetails() {
			this.isDetails = false;
		}
	},
	watch: {
		'$route.params'() {
			if (this.$route.params.cardId) this.isDetails = true
		}
	},
	async created() {
		if (this.$route.params.cardId) this.isDetails = true
		const boardId = this.$route.params.boardId;
		this.board = await boardService.getById(boardId);
		this.$store.commit({ type: 'updateCurrBoard', board: this.board })
	}


}
</script>

<style>
</style>