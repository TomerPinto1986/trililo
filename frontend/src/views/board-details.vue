<template>
    <section class="board-details">
        <h1>details</h1>
        <!-- <board-header :board="board"> -->
        <template v-if="board">
            <div v-for="cardList in board.lists" :key="cardList.id">
                <card-list :cardList="cardList" />
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