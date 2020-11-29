<template>
    <section class="card-checklist">
        <h2>Checklist</h2>
        <pre>{{checklist}}</pre>
    </section>
</template>

<script>
export default {
    props: {
        checklist: Object
    }
};
</script>