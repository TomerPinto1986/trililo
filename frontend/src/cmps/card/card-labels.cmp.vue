<template>
    <section class="card-label flex f-col f-center">
        <h3>Labels</h3>
        <ul class="label-list flex f-col">
            <li>
                <label-preview
                    class="flex"
                    v-for="label in boardLabels"
                    :key="label.id"
                    :label="label"
                    :card="card"
                    @updateCard="emitUpdateCard"
                    @updateLabelTitle="emitUpdateTitle"
                />
            </li>
        </ul>
    </section>
</template>

<script>
import labelPreview from './label-preview.cmp';

export default {
    props: {
        card: Object,
        boardLabels: Array
    },
    components: {
        labelPreview
    },
    methods: {
        emitUpdateCard(card) {
            this.$emit('updateCard', card);
        },
        emitUpdateTitle(labelId, title) {
            this.$emit('updateLabelTitle', labelId, title);
        }
    }
};
</script>