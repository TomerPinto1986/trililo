<template>
	<section v-if="board" class="board-header" ref="board-header">
		<div class="header-container flex">
			<input
				v-autowidth="{
					maxWidth: '960px',
					minWidth: '20px',
					comfortZone: 30,
				}"
				class="title"
				type="text"
				maxlength="20"
				@keyup.enter="emitTitleChange"
				@blur="emitTitleChange"
				v-model="boardTitle"
				ref="myInput"
			/>
			<button class="favorite flex f-center" v-if="isMarked" @click="toggleMarkBoard"><i class="fas fa-star"></i></button>
			<button class="favorite flex f-center" v-else @click="toggleMarkBoard"><i class="far fa-star"></i></button>
			<span class="seperator"></span>

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
			<span class="seperator"></span>
			<div class="board-members flex">
				<div
					v-for="member in boardMembers"
					:key="member.id"
					class="member"
				>
					<custom-avatar
						:size="35"
						:username="member.username"
						:src="member.imgUrl"
					/>
				</div>
				<span
					class="add-btn"
					v-if="!isAddUsers"
					@click="addUsers"
				>
					Invite
				</span>
				<add-users
					v-if="isAddUsers"
					:allUsers="users"
					:boardUsers="this.board.members"
					@closeUsers="closeUsers"
					@updateUsers="updateUsers"
				/>
			</div>
		</div>
		<button class="menu-btn" @click="emitOpenMenu">
			Show Menu
		</button>
	</section>
</template>

<script>
import addUsers from './add-users.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'


export default {
	props: {
		board: Object,
		users: Array,
		user: Object
	},
	data() {
		return {
			isMarked: false,
			boardTitle: null,
			isAddUsers: false,
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
		toggleMarkBoard(){
			this.isMarked = !this.isMarked;
		},
		emitOpenMenu() {
			this.$emit('openMenu')
		},
		addUsers() {
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
		closeMenu() {
			this.isMenu = false;
		},
		emitPrivacyChange() {
			this.$emit('privacyChange', this.privacy)
		},
		emitDeleteBoard(boardId) {
			this.$emit('deleteBoard', boardId)
		},
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
	destroyed() {
	},
	components: {
		customAvatar,
		addUsers,
	}
}
</script>

<style>
</style>