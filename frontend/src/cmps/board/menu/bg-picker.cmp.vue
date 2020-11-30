<template>
	<section class="bg-picker">
		<div class="photos"></div>
		<div class="colors"></div>
		<div v-if="isBg" class="background flex f-center wrap">
            <template></template>
			<div
				v-for="(color, idx) in colors"
				:key="color"
				:class="`bgc bgc-${idx + 1}`"
				@click="emitChange(color)"
			></div>
			<div v-for="(src, idx) in srcs" :key="src">
				<img @click="emitChange(`${idx}`)" :src="src" />
			</div>
		</div>
	</section>
</template>

<script>
export default {

}
</script>
