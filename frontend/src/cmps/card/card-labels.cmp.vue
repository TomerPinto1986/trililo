<template>
    <section class="card-label">
        <div class="label-header flex f-s-between">
            <h3>Labels</h3>
            <button>X</button>
        </div>
        <div class="label-main">
            <ul class="label-list">
                <li class="flex" v-for="label in board.labels" :key="label.id">
                    <div
                        class="label flex f-a-center"
                        :style="{ backgroundColor: label.color }"
                        @click="toggleLabelToCard(label.id)"
                    >
                        {{ label.title }}
                        {{ isSelect(label.id) }}
                    </div>
                    <button><i class="fal fa-pen"></i></button>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        card: Object,
        board: Object
    },
    methods: {
        toggleLabelToCard(labelId) {
            console.log('labelId:', labelId)
            // if (!this.card.labels) return;
            // let idx = this.card.labels.findIndex(label => label.id === labelId);
            // if (idx === -1) this.card.labels.push({ id: labelId });
            // else this.card.labels.splice(idx, 1);

            // const groupIdx = this.board.groups.findIndex(group => group.cards.some(card => card.id === this.card.id));
            // const cardIdx = this.board.groups[groupIdx].cards.findIndex(card => card.id === this.card.id);
            // this.board.groups[groupIdx].cards.splice(cardIdx, 1, this.card);
            // this.$emit('onUpdateBoard', this.board);
        },
        isSelect(labelId) {
            if(!this.card.labels) return;
            const labelsIds = this.card.labels.map(label => label.id);
            return labelsIds.includes(labelId) ? '                V' : '';
        }
    },
    created() {
        console.log(this.board.labels);
    }
};
</script>