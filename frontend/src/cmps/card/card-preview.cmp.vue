<template>
	<section class="card-preview flex f-col f-center">
		<div class="card-header" :style="headerStyle"></div>
		<div class="card-info flex f-center f-col">
			{{ card.title }}
			<div
				class="attachment"
				v-if="card.attachments && card.attachments.length"
			>
				<img :src="`${card.attachments[0].src}`" />
			</div>
			<div class="icons">
				<i v-if="card.description" class="fas fa-align-left"></i>
				<i v-if="card.checklist" class="fas fa-list"></i>
				<i v-if="card.attachments && card.attachments.length" class="fas fa-paperclip"></i>
			</div>
		</div>
	</section>
</template>

<script>

export default {
	props: {
		card: Object,

	},
	data() {
		return {
		}
	},
	computed: {
		headerStyle() {
			return { background: this.card.style.headerColor }
		}
	},
	methods: {

	},
	created() {
	}
};
</script>