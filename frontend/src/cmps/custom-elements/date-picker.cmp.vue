<template class="time-picker">
    <div class="block">
        <span class="demonstration">Default</span>
        <el-date-picker
            :default-value="defaultValue"
            ref="date"
            @change="setDate"
            v-model="value1"
            type="datetime"
            placeholder="Select Due Date"
            default-time="12:00:00"
            value-format="timestamp"
            :picker-options="pickerOptions"
        >
            >
        </el-date-picker>
        {{dueDate}} DATE
    </div>
</template>

<script>
export default {
    props: {
        dueDate: Number,
    },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
                shortcuts: [
                    {
                        text: 'Tomorrow',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: 'In a week',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
            },
            value1: '',
        };
    },
    computed: {
        defaultValue(){
            if (this.dueDate) return this.dueDate;
            return new Date();
        }
    },
    methods: {
        setDate() {
            if (this.dueDate) {
                console.log('card have DueDate');
                this.$emit('removeDate');
            }
            this.$emit('setDate', this.value1)
        },
        forcusInput() {
            console.log(this.$refs.date);
            this.$refs.date._data.pickerVisible = true;
        }
    },
    mounted() {
        this.forcusInput();
    }
};
</script>