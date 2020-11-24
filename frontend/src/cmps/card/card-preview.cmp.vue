<template>
    <section class="card-preview">
        {{card.title}}
    </section>
</template>

<script>
export default {
    props: {
        card: Object
    }
};
</script>