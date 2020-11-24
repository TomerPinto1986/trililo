<template>
    <section class="card-list">
        <card-preview v-for="card in cards" :key="card.id" :card="card" />
    </section>
</template>

<script>
import cardPreview from './card-preview.cmp';

export default {
    props: {
        cardList: Array
    },
    components: {
        cardPreview
    }
};
</script>