<template>
    <section class="card-list flex f-col f-center">
        <div class="card-list-header">
            {{cardsList.title}}
            <button @click="toggleSmallEditCard(cardsList.id)">...</button>
        </div>
        <card-preview v-for="card in cardsList.cards" :key="card.id" :card="card" @click.native="openDetails(card.id)"/>
        <button @click="addCard()">+ Add another card</button>
        <card-details v-if="isShowDetails" />
    </section>
</template>

<script>
import cardPreview from './card-preview.cmp';
import cardDetails from '@/views/card-details';

export default {
    props: {
        cardsList: Object
    },
    data(){
        return{
            isShowDetails: false
        }
    },
    methods: {
        toggleSmallEditCard(cardsListId) {
            console.log('open small list edit',cardsListId);
        },
        addCard(){
            console.log(this.cardsList);
        },
        openDetails(cardId){
            const boardId = this.$route.params.boardId
            this.$router.push(`/board/${boardId}/card/${cardId}`)
            this.isShowDetails = true
        }
    },
    components: {
        cardPreview,
        cardDetails
    }
};
</script>
