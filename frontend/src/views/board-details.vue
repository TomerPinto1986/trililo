<template>
	<section v-if="board" class="board-details flex f-col">
		<board-header :board="board" @updateBoard="updateBoard" />
		<div class="flex" v-if="board">
			<draggable
				class="drag-area flex"
				ghostClass="ghost"
				chosenClass="chosen"
				dragClass="drag"
				:list="board.groups"
				:animation="200"
				:group="'board'"
				:forceFallback="true"
				@change="updateBoard"
			>
				<group
					v-for="group in board.groups"
					:key="group.id"
					:group="group"
					@close="closeDetails"
					@newCard="saveNewCard"
					@change="updateGroup"
					@delete="deleteGroup"
				/>
			</draggable>

			<div class="add-group group flex f-center" @click="addGroup">
				<span v-if="!isAddingGroup">+ Add another list</span>
				<form v-else @submit.prevent="saveGroup">
					<input
						type="text"
						v-model="newGroupTitle"
						placeholder="Enter list title"
					/>
					<div class="new-group-btns">
						<button>Save</button>
						<button type="button" @click.stop="closeAddGroup">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
		<card-details
			v-if="isDetails"
			@close="closeDetails"
			@saveCard="updateCard"
			@deleteCard="deleteCard"
		/>
	</section>
</template>

<script>
import group from '../cmps/board/group.cmp';
import boardHeader from '../cmps/board/board-header.cmp';
import cardDetails from '@/views/card-details';
import draggable from 'vuedraggable'


export default {
	data() {
		return {
			board: this.boardToShow,
			isDetails: false,
			isAddingGroup: false,
			newGroupTitle: ''
		}
	},
	methods: {
		closeDetails() {
			this.isDetails = false;
			this.$router.push(`/board/${this.board._id}`)
		},
		setBoard(board) {
			this.board = JSON.parse(JSON.stringify(board));
		},
		async saveNewCard(title, groupId) {
			const newCard = this.setEmptyCard();
			newCard.title = title;
			newCard.byMember = this.$store.getters.loggedinUser;
			newCard.createdAt = Date.now();
			const board = await this.$store.dispatch({ type: 'addNewCard', newCard, groupId })
			this.setBoard(board);
		},
		async updateCard(card) {
			const board = await this.$store.dispatch({ type: 'updateCard', card })
			this.setBoard(board);
		},
		async deleteCard(cardId) {
			const board = await this.$store.dispatch({ type: 'deleteCard', cardId })
			this.setBoard(board);
		},
		async updateGroup(group) {
			const board = await this.$store.dispatch({ type: 'updateGroup', group })
			this.setBoard(board);
		},
		async deleteGroup(groupId) {
			const board = await this.$store.dispatch({ type: 'deleteGroup', groupId })
			this.setBoard(board);
		},
		async saveGroup() {
			const newGroup = this.setEmptyGroup();
			newGroup.title = this.newGroupTitle;
			const board = await this.$store.dispatch({ type: 'addNewGroup', newGroup })
			this.setBoard(board);
			this.closeAddGroup();
		},
		setEmptyCard() {
			this.$store.commit('setEmptyCard');
			return this.$store.getters.emptyCard;
		},
		setEmptyGroup() {
			this.$store.commit('setEmptyGroup');
			return this.$store.getters.emptyGroup;
		},
		addGroup() {
			this.isAddingGroup = true;
		},
		closeAddGroup() {
			this.isAddingGroup = false;
			this.newGroupTitle = '';
		},
		async updateBoard() {
			const board = await this.$store.dispatch({ type: 'updateBoard', newBoard: this.board });
			this.setBoard(board)
		}
	},
	computed: {
		boardToShow() {
			return this.$store.getters.currBoard;
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
		this.board = JSON.parse(JSON.stringify(board));
	},
	components: {
		group,
		boardHeader,
		cardDetails,
		draggable
	}
}
</script>

