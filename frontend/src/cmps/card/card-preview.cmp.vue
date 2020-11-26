<template>
	<section class="card-preview flex f-col f-center">
		<div class="card-header" :style="headerStyle"></div>
		<div class="card-info flex f-center f-col">
			<draggable draggable="true" @dragstart="dragStart" class="card-title">
				{{ card.title }}
			</draggable>
			<div class="attachment" v-if="card.attachments">
				<img :src="`${card.attachments[0].url}`" />
			</div>
		</div>
	</section>
</template>

<script>
import draggable from 'vuedraggable';

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
<<<<<<< HEAD
		dragStart(){
			console.log('start drag');
		}
	},
	components: {
		draggable
=======

	},
	created() {
>>>>>>> a181dec7c63466d88007e66d2a60de72faacac1c
	}
};
</script>