<template>
	<section v-if="board" class="board-details flex f-col">
		<board-header :board="board" @setBoard="setBoard" />
		<div class="flex" v-if="board">
			<div v-for="group in board.groups" :key="group.id">
				<group
					:group="group"
					@close="closeDetails"
					@newCard="saveNewCard"
				/>
			</div>
		</div>
		<card-details
			v-if="isDetails"
			@close="closeDetails"
			@saveCard="saveCard"
			@deleteCard="deleteCard"
		/>
	</section>
</template>

<script>
import group from '../cmps/board/group.cmp';
import boardHeader from '../cmps/board/board-header.cmp';
import cardDetails from '@/views/card-details';


export default {
	data() {
		return {
			board: null,
			isDetails: false
		}
	},
	methods: {
		closeDetails() {
			this.isDetails = false;
		},
		setBoard(board) {
			this.board = JSON.parse(JSON.stringify(board));
		},
		async saveNewCard(title, groupId) {
			console.log('title, groupId:', title, groupId)
			const newCard = this.getEmptyCard;
			newCard.title = title;
			console.log('newCard:', newCard)
			const board = await this.$store.dispatch({ type: 'addNewCard', newCard, groupId })
			this.setBoard(board);
		},
		async deleteCard(cardId) {
			const board = await this.$store.dispatch({ type: 'deleteCard', cardId })
			this.setBoard(board);

		},
		async saveCard(card) {
			const board = await this.$store.dispatch({ type: 'saveCard', card })
			this.setBoard(board);

		}
	},
	computed: {
		getEmptyCard() {
			this.$store.commit('getEmptyCard')
			const newCard = this.$store.getters.emptyCard
			console.log('card:', newCard)
			return newCard;
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
		const board = await this.$store.dispatch({ type: 'getBoardById', boardId });
		this.setBoard(board);
	},
	components: {
		group,
		boardHeader,
		cardDetails
	}
}
</script>

