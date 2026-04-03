<script>
	import * as d3 from 'd3';
	import {legendColor} from 'd3-svg-legend';
	import {onMount} from 'svelte';
	
	let width = 700;
	let height = 400;
	
	let margin = {top: 25, right: 245, bottom: 75, left: 30};

	const continents = [
		'South Asia',
		'Europe & Central Asia',
		'Sub-Saharan Africa',
		'America',
		'East Asia & Pacific',
		'Middle East & North Africa'
	];
	
	let data = [];
	onMount(async function() {
		data = await d3.json('https://vega.github.io/vega-datasets/data/gapminder.json');
		data = data.map(d => ({...d, continent: continents[d.cluster] }));
		console.log(data);
	});

	$: xScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.fertility)])
		.range([margin.left, width - margin.right]);
	
	$: yScale = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.life_expect)])
			.range([height - margin.bottom, margin.top])
	
	$: sizeScale = d3.scaleSqrt()
			.domain(d3.extent(data, d => d.pop))
			.range([5, 50])

	$: colorScale = d3.scaleOrdinal(d3.schemeTableau10)
			.domain(data.map(d => d.continent));

	$: colorLegend = legendColor()
			.shape('circle')
			.scale(colorScale);
	
	let xAxis;
	let yAxis;
	let legend;
	
	$: {
		d3.select(xAxis)
				.call(d3.axisBottom(xScale))
				// Add x-axis title 'text' element
				.append('text')
					.attr('text-anchor', 'end')
		      .attr('fill', 'black')
		      .attr('font-size', '12px')
		      .attr('font-weight', 'bold')
		      .attr('x', width - margin.right)
		      .attr('y', -10)
		      .text('Income');

		d3.select(yAxis)
				.call(d3.axisLeft(yScale))
				// Add y-axis title 'text' element.
		    .append('text')
		      .attr('transform', `translate(20, ${margin.top}) rotate(-90)`)
		      .attr('text-anchor', 'end')
		      .attr('fill', 'black')
		      .attr('font-size', '12px')
		      .attr('font-weight', 'bold')
		      .text('Life Expectancy');
		
		d3.select(legend).call(colorLegend);
	}

	$: minYear = d3.min(data, d => d.year);
	$: maxYear = d3.max(data, d => d.year);
	$: year = minYear;
</script>

<p>
	Year: <input type="range" 
					min={minYear} max={maxYear} step="5" 
					bind:value={year} /> 
	{year}
</p>

<svg {width} {height}>
	{#each data as d, i}
		{#if d.year == year}
			<circle
						cx={xScale(d.fertility)}
						cy={yScale(d.life_expect)}
						r={sizeScale(d.pop)}
						fill={colorScale(d.continent)} />
		{/if}
	{/each}
	
	<g transform="translate(0, {height - margin.bottom})"
		 bind:this={xAxis} />
	
	<g transform="translate({margin.left}, 0)"
		 bind:this={yAxis} />
	
	<g transform="translate({width + margin.left - margin.right}, {margin.top})"
		 bind:this={legend} />
</svg>

<style>
	svg {
		border: 2px dashed goldenrod;	
	}
	
	circle {
		fill-opacity: 0.75;
		stroke: white;
	}
</style>