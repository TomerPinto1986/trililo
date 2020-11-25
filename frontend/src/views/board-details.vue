<template>
	<section v-if="board" class="board-details flex f-col">
		<board-header :board="board" />
		<div class="flex" v-if="board">
			<div v-for="group in board.groups" :key="group.id">
				<group
					:group="group"
					:isDetails="isDetails"
					@close="closeDetails"
					@cardChange="updateBoard"
				/>
			</div>
		</div>
	</section>
</template>

<script>
import group from '../cmps/board/group.cmp';
import boardHeader from '../cmps/board/board-header.cmp';

export default {
	data() {
		return {
			board: null,
			isDetails: false
		}
	},
	components: {
		group,
		boardHeader
	},
	methods: {
		closeDetails() {
			this.isDetails = false;
		},
		updateBoard() {
			const boardId = this.$route.params.boardId;
			this.$store.dispatch({ type: 'getBoardById', boardId });
			this.board = JSON.parse(JSON.stringify(this.$store.getters.currBoard));
		}
	},
	watch: {
		'$route.params'() {
			if (this.$route.params.cardId) this.isDetails = true
		}
	},
	created() {
		if (this.$route.params.cardId) this.isDetails = true
		// this.updateBoard();
		const boardId = this.$route.params.boardId;
		this.$store.dispatch({ type: 'getBoardById', boardId });
		this.board = this.$store.getters.currBoard;
	}


}
</script>

<style>
</style>