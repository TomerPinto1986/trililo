<template>
    <section class="board-list">
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
            @deleted="deleteBoard"
        />
    </section>
</template>

<script>
import boardPreview from '../cmps/board/board-preview.cmp';

export default {
    data() {
        return {
            isAdding: false,
            newBoardTxt: ''
        }
    },
    computed: {
        boardsForDisplay() {
            return this.$store.getters.boards;
        }
    },
    methods: {
        deleteBoard(boardId) {
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
        }
    },
    components: {
        boardPreview
    }
}
</script>
