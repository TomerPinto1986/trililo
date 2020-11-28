<template>
    <section class="pop-up">
        <button @click="emitClose">x</button>
        <slot name="card-move"></slot>
        <slot name="date-picker"></slot>
        <slot name="add-members"></slot>
        <slot name="card-cover"></slot>
        <slot></slot>
    </section>
</template>

<script>
export default {
methods:{
    emitClose(){
        this.$emit('closePopup')
    }
}
}
</script>

<style>

</style>