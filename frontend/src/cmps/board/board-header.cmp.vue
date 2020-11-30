<template>
	<section v-if="board" class="board-header flex">
		<div class="header-container flex">
			<input
				class="title"
				type="text"
				@keyup.enter="emitTitleChange"
				@blur="emitTitleChange"
				v-model="boardTitle"
				ref="myInput"
			/>
						<span class="seperator"></span>

			<el-select
				v-model="privacy"
				class="privacy flex f-center"
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
				<div v-for="member in boardMembers" :key="member.id" class="member">
					<avatar
						:size="35"
						:lighten="-90"
						:customStyle="{ fontWeight: 'bold' }"
						:username="member.username"
					></avatar>
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
		</div>
		<button class="menu-btn" @click="emitOpenMenu">Menu</button>
	</section>
</template>

<script>
import addUsers from './add-users.cmp';
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
		emitBgChange(bgc) {
			this.$emit('changeBgc', bgc)
		},
		closeMenu() {
			this.isMenu = false;
		},
		emitPrivacyChange() {
			this.$emit('privacyChange', this.privacy)
		},
		emitDeleteBoard(boardId) {
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
	destroyed() {
	},
	components: {
		avatar,
		addUsers,
	}
}
</script>

<style>
</style>