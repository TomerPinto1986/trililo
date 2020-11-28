<template>
    <section v-if="board" class="board-header flex f-s-between">
        <input
            type="text"
            :placeholder="board.title"
            @keyup.enter="saveBoardTitle"
            @blur="saveBoardTitle"
            v-model="newBoard.title"
            ref="myInput"
        />
        <div>{{ isPrivate }}</div>
        <div class="board-members flex">
            <div v-for="member in boardMembers" :key="member.id">
                <avatar :size="40" :username="member.username">ss</avatar>
            </div>
            <button class="addUsers" @click="addUsers">Invite</button>
            <add-users
                v-if="isAddUsers"
                :users="users"
                @closeUsers="closeUsers"
                @updateUsers="updateUsers"
            />
        </div>
        <button @click="openMenu">Menu</button>
    </section>
</template>

<script>
import avatar from 'vue-avatar';
export default {
    props: {
        board: Object,
        users: Array
    },
    data() {
        return {
            newBoard: '',
            isAddUsers: false
        }
    },
    methods: {
        openMenu() {
            console.log('open menu');
        },
        addUsers() {
            console.log('Add member', this.users);
            this.isAddUsers = true;
		},
		closeUsers() {
			this.isAddUsers = false
		},
		updateUsers(userId) {
			console.log('updateing....',userId);
		},
        saveBoardTitle() {
            this.$emit('updateBoard', this.newBoard);
            setTimeout(() => {
                this.$refs.myInput.blur();
            }, 0);
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
        this.newBoard = this.board;
    },
    components: {
        avatar
    }
}
</script>

<style>
</style>