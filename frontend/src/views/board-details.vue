<template>
    <section class="board-details">
        <!-- <board-header :board="board"> -->
        <template v-if="board">
            <div v-for="group in board.groups" :key="group.id">
                <group :group="group" />
            </div>
        </template>
    </section>
</template>

<script>
import { boardService } from '../services/board.service.js';
import group from '../cmps/card/group.cmp';

export default {
    data() {
        return {
            board: null
        }
    },
    components: {
        group
    },
    async created() {
        const boardId = this.$route.params.boardId;
        this.board = await boardService.getById(boardId);
    }


}
</script>

<style>
</style>