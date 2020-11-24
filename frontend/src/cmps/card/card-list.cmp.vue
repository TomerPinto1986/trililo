<template>
    <section class="card-list">
        <div class="card-list-header">
            {{cardsList.title}}
            <button @click="toggleSmallEditCard(cardsList.id)">...</button>
        </div>
        <card-preview v-for="card in cardsList.cards" :key="card.id" :card="card" />
        <button @click="addCard()">+ Add another card</button>
    </section>
</template>

<script>
import cardPreview from './card-preview.cmp';

export default {
    props: {
        cardsList: Object
    },
    methods: {
        toggleSmallEditCard(cardsListId) {
            console.log('open small list edit',cardsListId);
        },
        addCard(){
            console.log(this.cardsList);
        }
    },
    components: {
        cardPreview
    }
};
</script>
