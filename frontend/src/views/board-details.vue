<template>
	<section
		v-if="board"
		class="board-details flex f-col"
		v-dragscroll:firstchilddrag
		:style="boardStyle"
	>
		<div class="screen" @click="goBack"></div>
		<board-header
			:board="board"
			:users="users"
			:user="user"
			@updateTitle="updateBoardTitle"
			@updateboardUsers="updateboardUsers"
			@changeBgc="changeBgc"
			@privacyChange="changePrivacy"
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
import bg1 from '../assets/bgs/bg1.jpg';
import bg2 from '../assets/bgs/bg2.jpg';
import bg3 from '../assets/bgs/bg3.jpg';
import bg4 from '../assets/bgs/bg4.jpg';
import bg5 from '../assets/bgs/bg5.jpg';
import bg6 from '../assets/bgs/bg6.jpg';

export default {
	data() {
		return {
			isDetails: false,
			isAddingGroup: false,
			newGroupTitle: '',
			isScroll: false,
			bgSrcs: [bg1, bg2, bg3, bg4, bg5, bg6]
		}
	},
	methods: {
		goBack() {
			document.body.querySelector('.screen').style.display = 'none';
			this.$router.go(-1)
		},
		closeDetails() {
			this.isDetails = false;
			this.$router.push(`/board/${this.board._id}`)
			document.body.querySelector('.screen').style.display = 'none';
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
		updateboardUsers(userId) {
			console.log('update', userId);
			const board = this.board;
			const memberIdx = board.members.findIndex(member => member._id === userId);
			if (memberIdx === -1) {
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
		},
		changeBgc(bgc) {
			const board = utilService.deepCopy(this.board);
			if (bgc.includes('rgb')) board.style.background = bgc;
			else board.style.background = `url(${this.bgSrcs[+bgc]})`
			this.updateBoard(board);
		},
		changePrivacy(privacy) {
			const board = utilService.deepCopy(this.board);
			board.isPrivate = (privacy === 'private');
			this.updateBoard(board)
		}
	},
	computed: {
		board() {
			if (this.$store.getters.currBoard) console.log(this.$store.getters.currBoard);
			return utilService.deepCopy(this.$store.getters.currBoard);
		},
		users() {
			return this.$store.getters.users;
		},
		user() {
			return this.$store.getters.loggedinUser;
		},
		// boardClass() {
		// 	return `${this.board.style.backgroundClass}`
		// },
		boardStyle() {
			console.log(this.board.style.background)
			return { 'background': `${this.board.style.background}` }
		}
	},
	watch: {
		'$route.params'() {
			if (this.$route.params.cardId) {
				this.isDetails = true;
			}
			else this.isDetails = false
		}
	},
	mounted() {
		setTimeout(() => {
			if (this.$route.params.cardId) document.body.querySelector('.screen').style.display = 'block';
		}, 500)
	},
	created() {
		this.$store.dispatch('loadUsers');
		if (this.$route.params.cardId) this.isDetails = true;
		const boardId = this.$route.params.boardId;
		this.$store.dispatch({ type: 'loadBoard', boardId });
	},
	destroyed() {
		this.$store.dispatch({ type: 'loadBoard', boardId: null });
	},
	components: {
		group,
		boardHeader,
		cardDetails,
		draggable
	}
}
</script>

