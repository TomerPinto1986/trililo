<template>
    <section class="card-preview">
        <div class="card-title">
            {{card.title}}
        </div>
        <div class="attachment" v-if="card.attachments">
            <img :src="`${card.attachments[0].url}`" />
        </div>

    </section>
</template>

<script>
export default {
    props: {
        card: Object
    }
};
</script>