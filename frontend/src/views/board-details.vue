<template>
	<section v-if="boardToShow" class="board-details flex f-col">
		<board-header :board="boardToShow" @updateBoard="updateBoard" />
		<div class="flex">
			<draggable
				class="drag-area flex"
				ghostClass="ghost"
				chosenClass="chosen"
				dragClass="drag"
				:list="boardToShow.groups"
				:animation="200"
				:group="'board'"
				:forceFallback="true"
				@change="updateBoard"
			>
				<group
					v-for="group in boardToShow.groups"
					:key="group.id"
					:group="group"
					@close="closeDetails"
					@newCard="saveCard"
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
			// board: this.boardToShow,
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
		// setBoard(board) {
		// 	this.boardToShow= JSON.parse(JSON.stringify(board));
		// },
		async saveCard(title, groupId) {
			const newCard = this.setEmptyCard();
			newCard.title = title;
			newCard.byMember = this.$store.getters.loggedinUser;
			newCard.createdAt = Date.now();
			this.$store.dispatch({ type: 'saveCard', newCard, groupId })
			// this.setBoard(board);
		},
		async updateCard(card) {
			const board= await this.$store.dispatch({ type: 'updateCard', card })
			this.setBoard(board);
		},
		async deleteCard(cardId) {
			const board= await this.$store.dispatch({ type: 'deleteCard', cardId })
			this.setBoard(board);
		},
		async updateGroup(group) {
			const board= await this.$store.dispatch({ type: 'updateGroup', group })
			this.setBoard(board);
		},
		async deleteGroup(groupId) {
			const board= await this.$store.dispatch({ type: 'deleteGroup', groupId })
			this.setBoard(board);
		},
		async saveGroup() {
			const newGroup = this.setEmptyGroup();
			newGroup.title = this.newGroupTitle;
			const board= await this.$store.dispatch({ type: 'addNewGroup', newGroup })
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
			const board= await this.$store.dispatch({ type: 'updateBoard', newBoard: this.boardToShow});
			this.setBoard(board)
		}
	},
	computed: {
		boardToShow() {
			console.log('computing')
			return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
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
		this.$store.dispatch({ type: 'loadBoard', boardId });
		// const boardToShow= await this.$store.dispatch({ type: 'loadBoard', boardId });
		// this.boardToShow= JSON.parse(JSON.stringify(board));
	},
	components: {
		group,
		boardHeader,
		cardDetails,
		draggable
	}
}
</script>

