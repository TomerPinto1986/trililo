<template>
    <section class="card-menu-edit">
        <textarea
					@keydown.enter.prevent
					@keyup.enter="saveCard"
					ref="card-title"
					class="title-edit-menu-bar"
					placeholder="Enter a title for this card…"
					maxlength="120"
					v-model="cardTxt"
				></textarea>
				<div class="add-card-btns flex">
					<button @click="saveTitle" class="edit-title-btn">Save</button>
				</div>
    </section>
</template>

<script>
export default {
    props: {
        card: Object
    },
    data(){
        return {
            cardTxt: this.card.title
        }
    },
    methods: {
        saveTitle(){
            console.log(this.cardTxt);
        }
    },
    mounted() {
        setTimeout(() => this.$refs['card-title'].focus(), 0);
    }
}
</script>

<style>

</style>