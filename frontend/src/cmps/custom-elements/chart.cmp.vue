<script>
import { Bar, Line } from "vue-chartjs";

export default {
	props: {
		data: Array,
		color: String,
		labels: Array
	},

	extends: Bar,
	mounted() {
		// Overwriting base render method with actual data.
		this.renderChart({
			labels: this.labels,
			datasets: [
				{
					label: 'Avg Price per Type',
					backgroundColor: this.color,
					data: this.data,
				},
			],
		});
	},
	watch: {
		color() {
			this.renderChart({
				labels: this.labels,
				datasets: [
					{
						label: 'Avg Price per Type',
						backgroundColor: this.color,
						data: this.data,
					},
				],
			});
		},
	},
};
</script>
