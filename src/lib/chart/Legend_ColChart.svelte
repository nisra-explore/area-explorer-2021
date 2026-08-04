<script>
	import { changeStrLegend } from "../utils";

	export let data;
	export let xKey = "x";
	export let yKey = "y";
	export let zKey = "ni";
	// export let wKey = true;
	export let topic_prev_available = true;
	export let decimals = null;
		

	$: sum = data.map(d => d[yKey]).reduce((a, b) => a + b, 0);
	$: psum = data.map(d => d[zKey]).reduce((a, b) => a + b, 0);

	function toPerc(val) {
		let str;
		if (decimals) {
			str = ((val / sum) * 100).toFixed(decimals) + '%';
		} else if ((val / sum) * 100 < 1) {
			str = '<1%';
		} else {
			str = ((val / sum) * 100).toFixed(0) + '%';
		}
		return str;
	}
</script>


<table class="legend">
	<tbody>
		{#each data as item, i}
		<tr>
			<td>
				<svg width="20" height="30" class="bullet">
				</svg> {item[xKey]} 
			</td>
			<td class="cell-right" style="vertical-align:top">
				{toPerc(item[yKey])}
				{#if zKey == "prev" && topic_prev_available}
				<!-- && wKey == true} -->
					<span class="" style="color: #1460aa">(2011 {changeStrLegend(Math.round(item[zKey]), '%')})</span>
				{:else if  zKey == "prev" && !topic_prev_available}
					<span class="" style="color: #1460aa"></span>
				{:else if zKey == "ni"}
					<span class="" style="color: #1460aa">(NI {toPerc(item[zKey])})</span>
				<!-- {:else if zKey == "ni" && wKey == false}
					<span class="" style="color: #1460aa">(NI {toPerc(item[zKey])})</span> -->
				<!-- {:else if zKey == "prev" && wKey == false}
					<span class="" style="color: #1460aa"></span> -->
				{/if}
			</td>
		</tr>
		{/each}
	</tbody>
</table>

<style>
	.bullet {
  	height: 15px;
  	width: 15px;
		display: inline-block;
		transform: translate(0, 2px);
	}
	table.legend {
		width: 100%;
		border-spacing: 0;
		border-collapse: collapse;
		margin-top: 1px;
	}
	td {
		font-size: 0.85em;
		margin: 0;
	}
	td.cell-right {
		font-size: 0.85em;
		text-align: right;
		width: 100px;
	}
	.legend {
		width: 100%;
		margin-top: 3px;
	}
	
</style>