<template>
	<section class="search">
		<input type="text" v-model="filterBy.txt" placeholder="Search..." @change="debSearch"/>
		<div class="users">
			<ul>
				<li v-for="member in board.members" :key="member._id" @click="setFilterUser(member._id)">
					{{member.username}}
				</li>
			</ul>
		</div>
		<div class="labeks">
			<ul>
				<li v-for="label in labels" :key="label.id" @click="setFilterLabel(label.id)">

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
				user: "",
				labels: ""
			},
			debTimeout: null
		}
	},
	methods:{
		emitFilter(){
			this.$emit('filter', utilService.deepCopy(this.filterBy))
		},
		debSearch(){
			if (this.debTimeout) clearTimeout(this.debTimeout);
			this.debTimeout = setTimeout(()=>this.emitFilter(), 500)
		},
		
	}
}
</script>

