<template>
<<<<<<< HEAD
	<section class="card-preview flex f-col f-center">
		<div class="card-header" :style="headerStyle"></div>
		<div class="card-info flex f-center f-col">
				{{ card.title }}
			<div class="attachment" v-if="card.attachments">
				<img :src="`${card.attachments[0].url}`" />
			</div>
		</div>
	</section>
</template>

<script>

=======
    <section class="card-preview flex f-col f-center">
        <div class="card-header" :style="headerStyle"></div>
        <div class="card-info flex f-center f-col">
            {{ card.title }}
        <div class="attachment" v-if="card.attachments">
        <img :src="`${card.attachments[0].url}`" />
        </div>
        </div>
    </section>
</template>

<script>
>>>>>>> 65d62ee2647be18c62b2feb07315ffd3e5e18dab
export default {
    props: {
        card: Object,

<<<<<<< HEAD
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

	},
	created() {
	}
=======
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

    },
    created() {
    }
>>>>>>> 65d62ee2647be18c62b2feb07315ffd3e5e18dab
};
</script>