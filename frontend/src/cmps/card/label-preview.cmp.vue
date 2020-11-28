<template>
    <section class="label-preview">
                            <div
                        class="label flex f-a-center"
                        :style="{ backgroundColor: label.color }"
                        @clabel-previewck.stop="toggleLabelToCard(label.id)"
                    >
                        <span v-if="!isEdit">{{ label.title }}</span>
                        <input v-else type="text" v-model="titleToEdit" />
                        {{ isSelect(label.id) }}
                    </div>
                    <button @click.stop="updateTitle(label.id)">
                        <i class="fal fa-pen"></i>
                    </button>
    </section>
</template>

<script>
import { utilService } from '../../services/util.service.js';

export default {
    props: {
        label: Object
    },
    data() {
        return {
            isEdit: false,
            titleToEdit: ''
        };
    },
    computed: {
        cardToEdit
    },
    methods: {
        toggleLabelToCard(labelId) {
            console.log('toggle');
            console.log('this.card:', this.card)
            const card = utilService.deepCopy(this.card);
            if (!card.labels) card.labels = [];
            const idx = card.labels.findIndex(label => label.id === labelId);
            if (idx === -1) card.labels.push({ id: labelId });
            else card.labels.splice(idx, 1);
            this.card = card;
            this.$emit('updateCard', card);
        },
        updateTitle(labelId) {
            const idx = this.card.labels.findIndex(label => label.id === labelId);
            if (idx === -1) return;
            this.titleToEdit = this.card.labels[idx].title;
            console.log('this.card.labels[idx].title:', this.card.labels[idx])
            console.log('----------------this.titleToEdit:', this.titleToEdit)
            this.isEdit = true;
        },
        isSelect(labelId) {
            if (!this.card.labels) return;
            const labelsIds = this.card.labels.map(label => label.id);
            return labelsIds.includes(labelId) ? 'V' : '';
        }
    }
};
</script>