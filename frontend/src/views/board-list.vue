<template>
    <div class="board-list-container flex f-col">
        <h3 class="">Choose your board</h3>
		<h4>or create one from screcth</h4>
        <section class="board-list flex wrap" v-if="boardsForDisplay">
            <div class="create-board board-preview flex f-center">
                <form v-if="isAdding" @submit.prevent="saveBoard">
                    <input
                        type="text"
                        v-model="newBoardTxt"
                        placeholder="Enter your board name"
                    />
                    <button>Create</button>
                </form>
                <button v-else @click="addBoard">+ CREATE BOARD</button>
            </div>

            <board-preview
                v-for="board in boardsForDisplay"
                :key="board._id"
                :boardDetails="board"
                :boardBg="boardBg(board.style.background)"
                @deleted="deleteBoard"
            />
        </section>
    </div>
</template>

<script>
import boardPreview from '../cmps/board/board-preview.cmp';

export default {
    data() {
        return {
            isAdding: false,
            newBoardTxt: '',
        }
    },
    computed: {
        boardsForDisplay() {
            return this.$store.getters.boards
        },
        loggedinUser() {
            return this.$store.getters.loggedinUser;
        }
    },
    methods: {
        deleteBoard(boardId) {
            if (!confirm('Are you sure you want to delete this board?')) return;
            this.$store.dispatch('deleteBoard', boardId);
        },
        addBoard() {
            this.isAdding = true;
        },
        async saveBoard() {
            if (this.newBoardTxt) {
                const savedBoard = await this.$store.dispatch('createNewBoard', this.newBoardTxt);
                this.$router.push(`/board/${savedBoard._id}`);
            }
            this.newBoardTxt = '';
            this.isAdding = false;
        },
        boardBg(bgc) {
            const bgSrcs = this.$store.getters.bgSrcs;
            const style = (bgc.includes('rgb')) ? bgc : `url(${bgSrcs[+bgc]})`;
            return style;
        }
    },
    created() {
        this.$store.dispatch('loadBoards');
        this.$store.dispatch('loadUsers');
        this.$store.commit('loadBgc')
    },
    components: {
        boardPreview
    }
}
</script>
