<script>
  import * as d3 from 'd3';

  let width = 500;
  let height = 160;

  export let data = [];
  export let title = "";

  let margin = { top: 25, right: 140, bottom: 35, left: 70 };
  let innerWidth  = width  - margin.left - margin.right;
  let innerHeight = height - margin.top  - margin.bottom;

  $: xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 1])
    .range([0, innerWidth]);

  $: yScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerHeight])
    .padding(0.65);

  $: colorScale = d3.scaleOrdinal(d3.schemeTableau10)
    .domain(data.map(d => d.label));

  $: maxBar = d3.greatest(data, d => d.value);

  let xAxis, yAxis;

  $: if (xAxis && yAxis) {
    d3.select(xAxis).call(
      d3.axisBottom(xScale)
        .ticks(Math.min(d3.max(data, d => d.value), 10))
    );
    d3.select(yAxis).call(d3.axisLeft(yScale));
  }
</script>

<div class="container">
  <svg viewBox="0 0 {width} {height}">
    <text
      x={margin.left + innerWidth / 2}
      y={margin.top / 2}
      text-anchor="middle"
      class="chart-title">
      {title}
    </text>
    <g transform="translate({margin.left}, {margin.top + innerHeight})"
       bind:this={xAxis} />
    <g transform="translate({margin.left}, {margin.top})"
       bind:this={yAxis} />
    <g transform="translate({margin.left}, {margin.top})">
      {#each data as d}
        <rect
          x={0}
          y={yScale(d.label)}
          width={xScale(d.value)}
          height={yScale.bandwidth()}
          fill={colorScale(d.label)}
        />
      {/each}
      {#if maxBar}
        <rect
          x={0}
          y={yScale(maxBar.label)}
          width={xScale(maxBar.value)}
          height={yScale.bandwidth()}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <text
          x={xScale(maxBar.value) + 8}
          y={yScale(maxBar.label) + yScale.bandwidth() / 2}
          text-anchor="start"
          dominant-baseline="middle"
          class="annotation">
          Most lines of code
        </text>
      {/if}
      <text
        x={innerWidth / 2}
        y={innerHeight + margin.bottom - 8}
        text-anchor="middle"
        class="axis-label">
        Lines of Code
      </text>
      <text
        x={-(innerHeight / 2)}
        y={-margin.left + 12}
        text-anchor="middle"
        transform="rotate(-90)"
        class="axis-label">
        <tspan>Programming</tspan>
        <tspan dy="1.2em" x={-(innerHeight / 2)}>Language</tspan>
      </text>
    </g>
  </svg>
  <ul class="legend">
    {#each data as d}
      <li style="--color: {colorScale(d.label)}">
        <span class="swatch"></span>
        {d.label} <em>({d.value})</em>
      </li>
    {/each}
  </ul>
</div>

<style>
  svg {
    max-width: 100%;
    height: auto;
    overflow: visible;
  }

  .container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .legend {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swatch {
    width: 12px;
    height: 12px;
    background-color: var(--color);
    flex-shrink: 0;
  }

  .chart-title {
    font-size: 0.8em;
    font-weight: bold;
    fill: currentColor;
  }

  .axis-label {
    font-size: 0.65em;
    fill: currentColor;
  }

  .annotation {
    font-size: 0.6em;
    fill: currentColor;
    font-style: italic;
  }
</style>
