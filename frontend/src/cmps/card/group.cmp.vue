<template>
    <section class="group">
        <div class="group-header">
            {{ group.title }}
            <button @click="toggleSmallEditCard(group.id)">...</button>
        </div>
        <card-preview v-for="card in group.cards" :key="card.id" :card="card" />
        <button @click="addCard()">+ Add another card</button>
    </section>
</template>

<script>
import cardPreview from './card-preview.cmp';

export default {
    props: {
        group: Object
    },
    methods: {
        toggleSmallEditCard(groupId) {
            console.log('open small list edit', groupId);
        },
        addCard() {
            console.log('Add new card:', this.group);
        }
    },
    components: {
        cardPreview
    }
};
</script>
