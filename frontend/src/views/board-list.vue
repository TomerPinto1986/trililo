<template>
    <div class="board-list-container flex f-col">
        <h3 class="">Choose your board</h3>
        <h4>or create one from screcth</h4>
        <section class="board-list" v-if="boards">
            <div class="create-board board-preview flex f-center">
                <!-- <form
                    class="flex f-col"
                    v-if="isAdding"
                    @submit.prevent="saveBoard"
                >
                    <input
						type="text"
						v-model="newBoardTxt"
						placeholder="Enter your board name"
					/>
                    <button class="create-btn">Create</button>
                </form>
                <button v-else @click="addBoard">+ CREATE BOARD</button> -->
                <button @click="saveBoard"><span>+</span> CREATE BOARD</button>
            </div>
            <board-preview
                v-for="board in favoritesBoards"
                :key="board._id"
                :boardDetails="board"
                :boardBg="boardBg(board.style.background)"
                @deleted="deleteBoard"
            />
            <board-preview
                v-for="board in otherBoards"
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
const Swal = require('sweetalert2');

export default {
    data() {
        return {
            isAdding: false,
            newBoardTxt: '',
        }
    },
    computed: {
        boards() {
            return this.$store.getters.boards
        },
        favoritesBoards() {
            return this.boards.filter(board => board.isMarked)
        },
        otherBoards() {
            return this.boards.filter(board => !board.isMarked)

        },
        loggedinUser() {
            return this.$store.getters.loggedinUser;
        }
    },
    methods: {
        async deleteBoard(boardId) {
            const userAnc = await Swal.fire({
                position: 'center',
                title: 'Are you sure you want to delete this board?',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#ff505b',
                cancelButtonColor: '#455a64',
                confirmButtonText: 'Delete'
            });
            if (!userAnc.isConfirmed) return;
            this.$store.dispatch('deleteBoard', boardId);
        },
        addBoard() {
            this.isAdding = true;
        },
        async saveBoard() {
            const savedBoard = await this.$store.dispatch('createNewBoard');
            this.$router.push(`/board/${savedBoard._id}`);
        },
        // async saveBoard() {
        // 	if (this.newBoardTxt) {
        // 		const savedBoard = await this.$store.dispatch('createNewBoard', this.newBoardTxt);
        // 		this.$router.push(`/board/${savedBoard._id}`);
        // 	}
        // 	this.newBoardTxt = '';
        // 	this.isAdding = false;
        // },
        boardBg(bgc) {
            const bgSrcs = this.$store.getters.sBgSrcs;
            const style = (bgc.includes('rgb')) ? bgc : `url(${bgSrcs[+bgc]})`;
            return style;
        }
    },
    // watch: {
    // 	'loggedInUser'() {
    // 		this.$store.dispatch('loadBoards')
    // 	}
    // },
    mounted() {
        window.scrollTo(0, 0);
    },
    created() {
        this.$store.dispatch('loadBoards')
        this.$store.dispatch('loadUsers');
        this.$store.commit('loadBgc');
    },
    components: {
        boardPreview
    }
}
</script>
