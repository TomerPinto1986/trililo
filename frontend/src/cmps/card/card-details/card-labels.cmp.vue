<template>
    <section class="card-label flex f-col f-center">
        <h3>Labels</h3>
        <ul class="label-list flex f-col">
            <li>
                <label-preview
                    class="flex"
                    v-for="(label,idx) in boardLabels"
                    :key="label.id"
                    :label="label"
                    :card="card"
                    :idx="idx"
                    @updateCard="emitUpdateCard"
                    @updateLabelTitle="emitUpdateTitle"
                />
            </li>
        </ul>
    </section>
</template>

<script>
import labelPreview from '../label-preview.cmp';

export default {
    props: {
        card: Object,
        boardLabels: Array,
        clickPos: Object
    },
    methods: {
        emitUpdateCard(card) {
            this.$emit('updateCard', card);
        },
        emitUpdateTitle(labelId, title) {
            this.$emit('updateLabelTitle', labelId, title);
        }
    },
    mounted(){
        this.$emit('setHeight', this.$el.clientHeight)
    },
     components: {
        labelPreview
    },
};
</script>