<template>
    <section class="card-preview flex f-col f-center">
        <div class="card-title">
            {{card.title}}
        </div>
        <div class="attachment" v-if="card.attachments">
            <img :src="`${card.attachments[0].url}`" alt="">
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