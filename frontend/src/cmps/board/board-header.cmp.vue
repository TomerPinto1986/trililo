<template>
	<section v-if="board" class="board-header flex">
		<input
			type="text"
			@keyup.enter="emitTitleChange"
			@blur="emitTitleChange"
			v-model="boardTitle"
			ref="myInput"
		/>
		<el-select
			v-model="privacy"
			class="privacy"
			popper-class="dropdown"
			@change="emitPrivacyChange"
		>
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			>
			</el-option>
		</el-select>
		<div class="board-members flex">
			<div v-for="member in boardMembers" :key="member.id">
				<avatar :size="35" :username="member.username"></avatar>
			</div>
			<span
				class="add-btn flex f-center"
				v-if="!isAddUsers"
				@click="addUsers"
			>
				<i class="fas fa-user-plus"></i>
			</span>
			<add-users
				v-if="isAddUsers"
				:allUsers="users"
				:boardUsers="this.board.members"
				@closeUsers="closeUsers"
				@updateUsers="updateUsers"
			/>
		</div>
		<button class="menu-btn" @click="toggleMenu">Menu</button>
		<board-menu
			v-if="isMenu"
			:board="board"
			@changeBgc="emitBgChange"
			@close="closeMenu"
			@deleteBoard="emitDeleteBoard"
		/>
	</section>
</template>

<script>
import addUsers from './add-users.cmp';
import boardMenu from './board-menu.cmp';
import avatar from 'vue-avatar';


export default {
	props: {
		board: Object,
		users: Array,
		user: Object
	},
	data() {
		return {
			boardTitle: null,
			isAddUsers: false,
			isMenu: false,
			options: (this.user._id !== 'guest') ? [
				{ value: 'private', label: 'Private' },
				{ value: 'public', label: 'Public' }
			] : [
					{ value: 'public', label: 'Public' }
				],
			privacy: null
		}
	},
	methods: {
		toggleMenu() {
			this.isMenu = !this.isMenu;
		},
		addUsers() {
			console.log('Add member', this.users);
			this.isAddUsers = true;
		},
		closeUsers() {
			this.isAddUsers = false
		},
		updateUsers(userId) {
			this.$emit('updateboardUsers', userId)
		},
		emitTitleChange() {
			this.$emit('updateTitle', this.boardTitle);
			setTimeout(() => {
				this.$refs.myInput.blur();
			}, 0);
		},
		emitBgChange(bgc) {
			this.$emit('changeBgc', bgc)
		},
		closeMenu() {
			this.isMenu = false;
		},
		emitPrivacyChange() {
			this.$emit('privacyChange', this.privacy)
		},
		emitDeleteBoard(boardId){
			this.$emit('deleteBoard', boardId)
		}
	},
	computed: {
		boardMembers() {
			return this.board.members;
		},
		isPrivate() {
			return this.board.isPrivate ? 'Private' : 'Public'
		}
	},
	created() {
		this.boardTitle = this.board.title;
		this.privacy = (this.isPrivate);
	},
	destroyed(){
	},
	components: {
		avatar,
		addUsers,
		boardMenu
	}
}
</script>

<style>
</style>