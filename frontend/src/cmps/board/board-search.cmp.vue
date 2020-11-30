<template>
	<section class="search">
		<input type="text" v-model="filterBy.txt" placeholder="Search..." @change="debSearch"/>
		<div class="users">
			<ul>
				<li v-for="member in board.members" :key="member._id">
					{{member.username}}
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
				username: "",
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
		}
	}
}
</script>

