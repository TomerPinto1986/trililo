<template>
	<section class="filter">
		<hr>
		<input type="text" v-model="filterBy.txt" placeholder="Search..." @input="debSearch"/>
		<hr>
		<div class="members">
			<h3 @click="toggleMembers">By Members</h3>
			<ul v-if="isMembers">
				<li v-for="member in board.members" :key="member._id" @click="setFilterMember(member._id)">
					<div class="member">{{member.username}}</div>
				</li>
			</ul>
		</div>
		<hr>
		<div class="labels flex f-col f-center">
			<h3 @click="toggleLabels">By Labels</h3>
			<ul v-if="isLabels">
				<li v-for="label in board.labels" :key="label.id" @click="setFilterLabel(label.id)">
					<div class="label flex f-center" :style="`background-color:${label.color}`">
					{{label.title}}
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>

<script>
import {utilService} from '../../services/util.service'
export default {
	props: {
		board: Object
	},
	data() {
		return {
			filterBy: {
				txt: "",
				membersIds: [],
				labelsIds: []
			},
			debTimeout: null,
			isMembers: false,
			isLabels: false,
		}
	},
	methods:{
		emitFilter(){
			console.log(this.filterBy)
			this.$emit('filter', utilService.deepCopy(this.filterBy))
		},
		debSearch(){

			if (this.debTimeout) clearTimeout(this.debTimeout);
			this.debTimeout = setTimeout(()=>this.emitFilter(), 500)
		},
		toggleMembers(){
			this.isMembers = !this.isMembers;
		},
		toggleLabels(){
			this.isLabels = !this.isLabels;
		},
		setFilterMember(memberId){
			if(this.filterBy.membersIds.includes(memberId)) {
				const idIdx = this.filterBy.membersIds.findIndex(currId => currId === memberId)
				if(idIdx !== -1) this.filterBy.membersIds.splice(idIdx, 1)
			} else this.filterBy.membersIds.push(memberId)
			this.emitFilter()
		},
		setFilterLabel(labelId){
			if(this.filterBy.labelsIds.includes(labelId)) {
				const idIdx = this.filterBy.labelsIds.findIndex(currId => currId === labelId)
				if(idIdx !== -1) this.filterBy.labelsIds.splice(idIdx, 1)
			} else this.filterBy.labelsIds.push(labelId)
			this.emitFilter()
		}
		
	}
}
</script>

