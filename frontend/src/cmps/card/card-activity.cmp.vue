<template>
    <section v-if="activities" class="card-activity">
        <h2>activities:</h2>
        <activity-preview v-for="activity in activities" :key="activity.id" :activity="activity" />
    </section>
</template>

<script>
import activityPreview from './activity-preview.cmp.vue';

export default {
    props:{
        activities: Array
    },
    computed: {
    },
    components: {
        activityPreview
    }
};
</script>