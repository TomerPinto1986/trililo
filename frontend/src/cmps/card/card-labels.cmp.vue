<template>
    <section class="card-label flex f-s-between">
        <h3>Labels</h3>
        <label-preview
            class="flex"
            v-for="label in board.labels"
            :key="label.id"
            :label="label"
        />
    </section>
</template>

<script>
import labelPrivew from './label-preview.cmp';

export default {
    props: {
        card: Object,
        board: Object
    },
    components: {
        labelPrivew
    }
};
</script>