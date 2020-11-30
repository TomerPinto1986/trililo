<template>
	<section class="card-cover">
		<input type="color" v-model="newColor" @change="emitColorChange"/>
	</section>
</template>

<script>
export default {
	props: {
		color: String
	},
	data() {
		return {
			newColor: ''
		}
    },
    methods:{
        emitColorChange(){
            this.$emit('colorChange', this.newColor);
        }
    },
	created() {
		this.newColor = this.color;
	}
}
</script>
