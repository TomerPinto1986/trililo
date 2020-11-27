<template>
    <section class="set-due-date">
        <date-picker @setDate="setDate"/>
    </section>
</template>

<script>
import datePicker from './date-picker.cmp'

export default {
    methods: {
        setDate(date){
            console.log(date);
        }
    },

components:{
    datePicker
}
}
</script>

<style>

</style>