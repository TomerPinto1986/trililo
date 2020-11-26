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
		card: Object
	},
	computed: {
		headerStyle() {
			return { background: this.card.style.headerColor }
		}
	},
	methods: {
		dragStart(){
			console.log('start drag');
		}
	},
	components: {
		draggable
	}
};
</script>