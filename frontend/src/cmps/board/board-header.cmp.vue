<template>
    <section v-if="board" class="board-header flex f-s-between">
        <input
            type="text"
            :placeholder="board.title"
            @keyup.enter="saveBoardTitle"
            v-model="newBoardTitle"
            ref="myInput"
        />
        <div>{{ isPrivate }}</div>
        <div class="board-members flex">
            <div v-for="member in boardMembers" :key="member.id">
                <avatar :username="member.username">ss</avatar>
            </div>
            <button class="addMember" @click="addMember">Invite</button>
        </div>
        <button @click="openMenu">Menu</button>
    </section>
</template>

<script>
import avatar from 'vue-avatar';
export default {
    props: {
        board: Object,
    },
    data() {
        return {
            newBoardTitle: ''
        }
    },
    methods: {
        openMenu() {
            console.log('open menu');
        },
        addMember() {
            console.log('Add member');
        },
        async saveBoardTitle() {
            if (this.newBoardTitle !== this.board.title) {
                const board = await this.$store.dispatch({ type: 'updateBoard', newBoardTitle: this.newBoardTitle });
                this.$emit('setBoard', board);
            }
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
        },
    },
    created() {
        this.newBoardTitle = this.board.title;
    },
    components: {
        avatar
    }
}
</script>

<style>
</style>