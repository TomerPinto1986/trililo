<template>
	<section class="card-preview flex f-col f-center">
		<div class="card-header" :style="headerStyle"></div>
		<div class="card-info flex f-center f-col">
			<ul class="label-marks">
				<li class="flex" v-for="label in labelsSelected" :key="label">
					<div
						class="label"
						:style="{ backgroundColor: label }"
					></div>
				</li>
			</ul>
			{{ card.title }}
			<div class="attachment" v-if="card.attachments">
				<img :src="`${card.attachments[0].src}`" />
			</div>
		</div>
		<div class="icons">
			<i v-if="card.description" class="fas fa-align-left"></i>
			<i v-if="card.checklist" class="fas fa-list"></i>
			<i
				v-if="card.attachments && card.attachments.length"
				class="fas fa-paperclip"
			></i>
		</div>
	</section>
</template>

<script>

export default {
    props: {
        card: Object,
        labels: Array
    },
    data() {
        return {
        }
    },
    computed: {
        headerStyle() {
            return { background: this.card.style.headerColor }
        },
        labelsSelected() {
            if (!this.card.labels) return [];
            const selectIds = this.card.labels.map(label => label.id);
            const selctLabels = this.labels.filter(label => selectIds.includes(label.id));
            return selctLabels.map(label => label.color);
        }
    },
    methods: {

	},
	created() {
	}
};
</script>