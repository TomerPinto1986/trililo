<template>
	<section v-if="board" class="board-header">
		<div class="header-container">
			<input
				v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 30}"
				class="title float"
				type="text"
				maxlength="20"
				@keyup.enter="emitTitleChange"
				@blur="emitTitleChange"
				v-model="boardTitle"
				ref="myInput"
			/>
						<span class="seperator float"></span>

			<el-select
				v-model="privacy"
				class="privacy float"
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
			<span class="seperator float"></span>
			<div class="board-members float">
				<div v-for="member in boardMembers" :key="member.id" class="member float">
					<avatar
						:size="35"
						:lighten="-90"
						:customStyle="{ fontWeight: 'bold' }"
						:username="member.username"
					></avatar>
				</div>
				<span
					class="add-btn float"
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
		<button class="menu-btn float-r" @click="emitOpenMenu">Show Menu</button>
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
		avatar,
		addUsers,
	}
}
</script>

<style>
</style>