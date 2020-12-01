<template>
	<!-- <section
		v-if="board"
		class="board-details flex f-col"
		v-dragscroll:firstchilddrag
		:style="boardStyle"
	> -->
	<section v-if="board" class="board-details flex f-col">
		<!-- <div class="screen" @click="goBack"></div> -->
		<board-header
			:board="board"
			:users="users"
			:user="user"
			@openMenu="toggleMenu"
			@updateTitle="updateBoardTitle"
			@updateboardUsers="updateboardUsers"
			@changeBgc="changeBgc"
			@privacyChange="changePrivacy"
			@deleteBoard="deleteBoard"
		/>
		<div class="flex group-container" v-dragscroll:firstchilddrag>
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
					:filterBy="filterBy"
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
		<div class="window" v-if="isDetails" @click="closeDetails">
			<card-details
				@close="closeDetails"
				@addCard="updateCard"
				@deleteCard="deleteCard"
			/>
		</div>
		<board-menu
			v-if="isMenu"
			:board="board"
			@changeBgc="changeBgc"
			@close="toggleMenu"
			@deleteBoard="deleteBoard"
			@filter="filter"
		/>
	</section>
</template>

<script>
import draggable from 'vuedraggable'
import group from '../cmps/board/group.cmp';
import boardHeader from '../cmps/board/board-header.cmp';
import cardDetails from '@/views/card-details';
import boardMenu from '../cmps/board/menu/board-menu.cmp';
import { utilService } from '@/services/util.service';
import { socketService } from '@/services/socket.service';

export default {
	data() {
		return {
			isDetails: false,
			isAddingGroup: false,
			newGroupTitle: '',
			isScroll: false,
			isMenu: false,
			filterBy: null
		}
	},
	methods: {
		toggleMenu() {
			this.isMenu = !this.isMenu;
		},
		// goBack() {
		// 	document.body.querySelector('.screen').style.display = 'none';
		// 	this.$router.go(-1)
		// },
		closeDetails() {
			this.isDetails = false;
			this.$router.push(`/board/${this.board._id}`)
			// document.body.querySelector('.screen').style.display = 'none';
		},
		addCard(title, groupId) {
			const newCard = this.getEmptyCard();
			newCard.title = title;
			newCard.byMember = this.$store.getters.loggedinUser;
			newCard.createdAt = Date.now();
			const board = this.board;
			const group = this.board.groups.find(group => group.id === groupId);
			group.cards.push(newCard);
			this.updateBoard(board);
			this.addActivity(` added `, newCard)
			// this.addActivity(` added the card '${newCard.title}'`, newCard)
		},
		updateCard(card) {
			const board = this.board;
			board.groups.forEach(group => {
				const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
				if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
			})
			this.updateBoard(board);
		},
		deleteCard(cardId) {
			const board = this.board;
			let cardTitle;
			board.groups.forEach(group => {
				const cardIdx = group.cards.findIndex(currCard => currCard.id === cardId);
				if (cardIdx !== -1) {
					cardTitle = group.cards[cardIdx].title;
					group.cards.splice(cardIdx, 1);
				}
			})
			this.updateBoard(board);
			this.addActivity(`deleted the card '${cardTitle}'`)

		},
		updateGroup(group) {
			const board = this.board;
			const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id);
			board.groups.splice(groupIdx, 1, group);
			this.updateBoard(board);
		},
		deleteGroup(groupId) {
			const board = this.board;
			const groupIdx = board.groups.findIndex(currGroup => currGroup.id === groupId);
			board.groups.splice(groupIdx, 1);
			this.updateBoard(board);
			this.addActivity('deleted a group')

		},
		newGroup() {
			const newGroup = this.getEmptyGroup();
			newGroup.title = this.newGroupTitle;
			const board = this.board;
			board.groups.push(newGroup);
			this.updateBoard(board);
			this.closeAddGroup();
			this.addActivity('added a group')

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
			console.log(board)
			this.$store.dispatch({ type: 'updateBoard', board });
			socketService.emit('updateBoard', board);
		},
		updateboardUsers(userId) {
			const board = this.board;
			const memberIdx = board.members.findIndex(member => member._id === userId);
			const user = this.$store.getters.users.find(user => user._id === userId);
			if (memberIdx === -1) {
				const boardUser = {
					_id: user._id,
					username: user.username,
					imgUrl: user.imgUrl
				};
				board.members.push(boardUser);
			} else {
				board.members.splice(memberIdx, 1);
			}
			this.updateBoard(board);
			const action = (memberIdx === -1) ? `added ${user.username} to the board` : `removed ${user.username} from the board`;
			this.addActivity(action);

		},
		updateBoardTitle(boardTitle) {
			const board = this.board;
			board.title = boardTitle;
			this.updateBoard(board);
		},
		changeBgc(bgc) {
			this.$store.commit({ type: 'bgChange', bgc })
			const board = utilService.deepCopy(this.board);
			board.style.background = bgc;
			this.updateBoard(board);
		},
		changePrivacy(privacy) {
			const board = utilService.deepCopy(this.board);
			board.isPrivate = (privacy === 'private');
			this.updateBoard(board)
			this.addActivity(`changed the board privacy to ${privacy}`)

		},
		deleteBoard(boardId) {
			this.$store.dispatch('deleteBoard', boardId);
			setTimeout(() => { this.$router.push('/board'); }, 200)
		},
		addActivity(txt, card) {
			this.$store.commit('setEmptyActivity');
			const activity = utilService.deepCopy(this.$store.getters.emptyActivity);
			activity.txt = txt;
			activity.byMember = utilService.deepCopy(this.$store.getters.loggedinUser);
			activity.createdAt = Date.now();
			if (card) activity.card = {
				id: card.id,
				title: card.title,
			}
			const board = this.board;
			board.activities.unshift(activity);
			this.updateBoard(board);
		},
		filter(filterBy) {
			this.filterBy = filterBy
		},
		updateBoardSocket(board) {
			console.log(board)
			this.$store.dispatch({ type: 'updateBoard', board });
		}
	},
	computed: {
		board() {
			if (this.$store.getters.currBoard) {
				socketService.emit('board-topic', this.$store.getters.currBoard._id)
			}
			return utilService.deepCopy(this.$store.getters.currBoard);
		},
		users() {
			return this.$store.getters.users;
		},
		user() {
			return this.$store.getters.loggedinUser;
		},
		boardStyle() {
			return { 'background': `${this.board.style.background}` }
		}
	},
	watch: {
		'$route.params'() {
			if (this.$route.params.cardId) {
				this.isDetails = true;
			}
			else this.isDetails = false
		},
		'$store.getters.loggedinUser'() {
			if (this.$store.getters.loggedinUser._id === 'guest' && this.board.isPrivate) this.$router.push('/board')
		}
	},
	mounted() {
		// setTimeout(() => {
		// 	if (this.$route.params.cardId) document.body.querySelector('.screen').style.display = 'block';
		// }, 600)
	},
	created() {
		this.$store.dispatch('loadUsers');
		if (this.$route.params.cardId) this.isDetails = true;
		const boardId = this.$route.params.boardId;
		this.$store.dispatch({ type: 'loadBoard', boardId });
		setTimeout(() => {
			if (this.$store.getters.loggedinUser._id === 'guest' && this.board.isPrivate) this.$router.push('/board')
		}, 500)
		socketService.on('boardUpdate', this.updateBoardSocket)
	},
	destroyed() {
		socketService.off('boardUpdate', this.updateBoard)
		this.$store.dispatch({ type: 'loadBoard', boardId: null });
	},
	components: {
		group,
		boardHeader,
		cardDetails,
		draggable,
		boardMenu
	}
}
</script>

