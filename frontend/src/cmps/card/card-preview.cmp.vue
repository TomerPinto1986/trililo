<template>
	<section class="card-preview flex f-col">
		<div
			v-if="card.style.headerColor"
			class="card-header"
			:style="headerStyle"
		></div>
		<div class="card-info flex f-col">
			<ul v-if="labelsSelected.length" class="label-marks flex wrap">
				<li class="flex" v-for="label in labelsSelected" :key="label">
					<div
						class="label"
						:style="{ backgroundColor: label }"
					></div>
				</li>
			</ul>
			<span class="description" >{{ card.title }}</span>
			<div
				class="attachment"
				v-if="card.attachments && card.attachments.length"
			>
				<img :src="`${card.attachments[0].src}`" />
			</div>
		</div>
		<div class="icons flex wrap">
			<span class="small-icons">
				<i v-if="card.dueDate" :style="dueDate" class="far fa-clock">
					<span> {{moment(card.createdAt).format("MMM, Do")}}</span>
				</i>
				<i v-if="card.description" class="fas fa-align-left"></i>
				<i v-if="card.checklist" class="fas fa-list"></i>
				<i
					v-if="card.attachments && card.attachments.length"
					class="fas fa-paperclip"
				></i>
			</span>
			<span class="members-container flex" v-if="card.members && card.members.length">
				<div
					class="card-members"
					v-for="member in card.members"
					:key="member._id"
				>
					<custom-avatar :size="30" :username="member.username" :src="member.imgUrl"/>
				</div>
			</span>
		</div>
	</section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'

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
		dueDate() {
			if (this.card.dueDate - Date.now() < 24 * 60 * 60 * 1000) return { color: '#fff', backgroundColor: 'rgba(255, 0, 0, 0.664)' }
			if (this.card.dueDate - Date.now() < 7 * 24 * 60 * 60 * 1000) return { color: '#121212', backgroundColor: 'rgba(255, 255, 0, 0.616)' }
			else return { color: '#fff', backgroundColor: 'rgba(0, 128, 0, 0.664)' }
		},
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
	},
	components: {
		customAvatar
	}
};
</script>