<template>
    <section class="board-details">
        <!-- <board-header :board="board"> -->
        <template v-if="board">
            <div v-for="(cardsList) in board.lists" :key="cardsList.id">
                <card-list :cardsList="cardsList" />
            </div>
        </template>
    </section>
</template>

<script>
import { boardService } from '../services/board.service.js';
import cardList from '../cmps/card/card-list.cmp';

export default {
    data() {
        return {
            board: null
        }
    },
    components: {
        cardList
    },
    async created() {
        const boardId = this.$route.params.boardId;
        this.board = await boardService.getById(boardId);
    }


}
</script>

<style>
</style>