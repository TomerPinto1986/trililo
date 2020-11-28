<template>
	<section v-if="board" class="board-details flex f-col" v-dragscroll:firstchilddrag>
		<board-header
			:board="board"
			:users="users"
			@updateTitle="updateBoardTitle"
			@updateboardUsers="updateboardUsers"
		/>
		<div class="flex group-container">
			<draggable
				v-dragscroll:nochilddrag
				class="drag-area flex"
				ghostClass="ghost"
				chosenClass="chosen"
				dragClass="drag"
				:list="board.groups"
				:animation="200"
				:group="'board'"
				:forceFallback="true"
				@change="updateBoard(board)"
			>
				<group
					data-no-dragscroll
					v-for="group in board.groups"
					:key="group.id"
					:group="group"
					:labels="board.labels"
					@close="closeDetails"
					@newCard="addCard"
					@change="updateGroup"
					@delete="deleteGroup"
				/>
			</draggable>

            <div class="add-group group flex f-center" @click="addGroup">
                <span v-if="!isAddingGroup">+ Add another list</span>
                <form v-else @submit.prevent="newGroup">
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
            @addCard="updateCard"
            @deleteCard="deleteCard"
        />
    </section>
</template>

<script>
import group from '../cmps/board/group.cmp';
import boardHeader from '../cmps/board/board-header.cmp';
import cardDetails from '@/views/card-details';
import draggable from 'vuedraggable'
import { utilService } from '@/services/util.service';

export default {
	data() {
		return {
			isDetails: false,
			isAddingGroup: false,
			newGroupTitle: '',
			isScroll: false
		}
	},
	methods: {
		closeDetails() {
			this.isDetails = false;
			this.$router.push(`/board/${this.board._id}`)
		},
		addCard(title, groupId) {
			const newCard = this.getEmptyCard();
			newCard.title = title;
			newCard.byMember = this.$store.getters.loggedinUser;
			newCard.createdAt = Date.now();
			const board = this.board;
			const group = this.board.groups.find(group => group.id === groupId);
			group.cards.push(newCard);
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		updateCard(card) {
			const board = this.board;
			board.groups.forEach(group => {
				const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
				if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
			})
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		deleteCard(cardId) {
			const board = this.board;
			board.groups.forEach(group => {
				const cardIdx = group.cards.findIndex(currCard => currCard.id === cardId);
				if (cardIdx !== -1) group.cards.splice(cardIdx, 1);
			})
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		updateGroup(group) {
			const board = this.board;
			const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id);
			board.groups.splice(groupIdx, 1, group);
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		deleteGroup(groupId) {
			const board = this.board;
			const groupIdx = board.groups.findIndex(currGroup => currGroup.id === groupId);
			board.groups.splice(groupIdx, 1);
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		newGroup() {
			const newGroup = this.getEmptyGroup();
			newGroup.title = this.newGroupTitle;
			const board = this.board;
			board.groups.push(newGroup);
			this.$store.dispatch({ type: 'updateBoard', board });
			this.closeAddGroup();
		},
		getEmptyCard() { //maybe get from service direct
			this.$store.commit('setEmptyCard');
			return this.$store.getters.emptyCard;
		},
		getEmptyGroup() {
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
		updateBoard(board) {
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		updateboardUsers(userId){
			console.log('update',userId);
			const board = this.board;
			const memberIdx = board.members.findIndex(member => member._id === userId);
			if (memberIdx === -1){
				console.log();
				const user = this.$store.getters.users.find(user => user._id === userId);
				const boardUser = {
                    _id: user._id,
                    username: user.username,
                    imgUrl: user.imgUrl
                };
				board.members.push(boardUser);
			} else {
				board.members.splice(memberIdx, 1);
			}
			this.$store.dispatch({ type: 'updateBoard', board });
		},
		updateBoardTitle(boardTitle) {
			const board = this.board;
			board.title = boardTitle;
			this.updateBoard(board);
		}
	},
	computed: {
		board() {
			return utilService.deepCopy(this.$store.getters.currBoard);
		},
		users() {
			return this.$store.getters.users;
		}
	},
	watch: {
		'$route.params'() {
			if (this.$route.params.cardId) this.isDetails = true;
		}
	},
	created() {
		this.$store.dispatch('loadUsers');
		if (this.$route.params.cardId) this.isDetails = true;
		const boardId = this.$route.params.boardId;
		this.$store.dispatch({ type: 'loadBoard', boardId });
	},

	components: {
		group,
		boardHeader,
		cardDetails,
		draggable
	}
}
</script>

