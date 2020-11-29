<template>
    <section class="add-checklist" @click.stop>
        <h2>Add Checklist</h2>
        <hr />
        <h3>Title</h3>
        <form @submit.prevent="addChecklist">
            <input type="text" v-model="titleToEdit" />
            <button>Add</button>
        </form>
    </section>
</template>

<script>
import { utilService } from '../../services/util.service';

export default {
    props: {
        card: Object
    },
    data() {
        return {
            titleToEdit: 'Checklist'
        };
    },
    methods: {
        addChecklist() {
            const card = utilService.deepCopy(this.card);
            if (!card.checklistGroup) card.checklistGroup = [];
            card.checklistGroup.push({ title: this.titleToEdit, items: [] });
            this.$emit('updateCard', card);
            this.$emit('close');
        }
    }
};
</script>