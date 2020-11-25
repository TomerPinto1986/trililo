<template>
	<section class="card-preview flex f-col f-center">
		<div class="card-header" :style="headerStyle"></div>
		<div class="card-info">
			<div class="card-title">
				{{ card.title }}
			</div>
			<div class="attachment" v-if="card.attachments">
				<img :src="`${card.attachments[0].url}`" />
			</div>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		card: Object
	},
	computed: {
		headerStyle() {
			return { background: this.card.style.headerColor }
		}
	}
};
</script>