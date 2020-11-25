<template>
    <section class="card-activity">
        <h2>activities:</h2>
        <activity-preview v-for="activity in activities" :key="activity.id" :activity="activity" />
    </section>
</template>

<script>
import activityPreview from './activity-preview.cmp.vue';

export default {
    computed: {
        activities() {
            return this.$store.getters.activities;
        }
    },
    components: {
        activityPreview
    }
};
</script>