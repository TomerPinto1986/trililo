<template>
    <section class="board-preview flex f-center f-col" :style="boardStyle" @click="goToBoard">
        <h2>{{ boardDetails.title }}</h2>
        <button class="delete-btn" @click.stop="emitDelete"><i class="fas fa-trash-alt"></i></button>
        <!-- <button class="delete-btn" @click.stop="emitDelete">Delete Board</button> -->
    </section>
</template>

<script>
export default {
    props: {
        boardDetails: Object
    },
    computed: {
        boardStyle() {
            return { 'background': this.boardDetails.style.background };
        }
    },
    methods: {
        goToBoard() {
            this.$router.push(`/board/${this.boardDetails._id}`);
        },
        emitDelete() {
            this.$emit('deleted', this.boardDetails._id);
        }
    }
}
</script>

