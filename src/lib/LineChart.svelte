<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { currentYear } from './stores.js';

  const TOTAL_W = 910;
  const LC_MARGIN = { top: 155, right: 50, bottom: 40, left: 70 };
  const LC_W = TOTAL_W - LC_MARGIN.left - LC_MARGIN.right;
  const LC_H = 370 - LC_MARGIN.top - LC_MARGIN.bottom;

  const ANNOT_ROW_Y = [-44, -66, -88, -110, -134];
  const GREEN_LINE_EXTENSION_ANNOTATIONS = [
    { year: 2005, label: 'Conservation Law Foundation sued state', type: 'greenLineExtension' },
    { year: 2007, label: 'Settlement — commit to finish by 2014', type: 'greenLineExtension' },
    { year: 2008, label: 'Global Financial Crisis', type: 'event' },
    { year: 2012, label: 'Construction broke ground', type: 'greenLineExtension' },
    { year: 2015, label: 'Nearly cancelled ($3B cost overrun)', type: 'greenLineExtension' },
    { year: 2017, label: 'Redesigned & restarted', type: 'greenLineExtension' },
    { year: 2018, label: 'Construction restarted', type: 'greenLineExtension' },
    { year: 2020, label: 'COVID-19 pandemic', type: 'event' },
    { year: 2022, label: 'Union Sq & Medford branch opened', type: 'greenLineExtension' },
  ];

  const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const CITY_BASE_COLORS = {
    Cambridge: [37, 99, 235],
    Somerville: [234, 88, 12],
    Medford: [22, 163, 74],
  };

  let housing = [];
  let loading = true;
  let lineTooltip = { visible: false, x: 0, y: 0, zip: '', city: '', value: '', yr: 0 };
  let isDraggingYear = false;
  let housingByZip = {};
  let selectedZips = new Set();
  let selectedCities = new Set();
  let xScale, yScale, lineGen;
  let allValues = [];
  let globalMin = 0;
  let globalMax = 1;
  let lineData = [];
  let annotAssignments = [];

  const N_BUCKETS = 7;

  onMount(async () => {
    const housingData = await d3.json(`${base}/housing.json`);
    housing = housingData;
    housingByZip = Object.fromEntries(housing.map(d => [d.zip, d]));
    loading = false;

    allValues = housing.flatMap(d => Object.values(d.values));
    globalMin = d3.min(allValues) ?? 0;
    globalMax = d3.max(allValues) ?? 1;

    const thresholds = d3.range(N_BUCKETS - 1).map(i =>
      globalMin + (i + 1) * (globalMax - globalMin) / N_BUCKETS
    );

    xScale = d3.scaleLinear().domain([YEARS[0], YEARS[YEARS.length - 1]]).range([0, LC_W]);
    yScale = d3.scaleLinear().domain([globalMin * 0.95, globalMax * 1.05]).range([LC_H, 0]);

    lineGen = d3.line()
      .x(([yr]) => xScale(yr))
      .y(([, val]) => yScale(val))
      .defined(([, val]) => val != null);

    lineData = housing.map(d => ({
      zip: d.zip,
      city: d.city,
      points: YEARS.map(yr => [yr, d.values[String(yr)] ?? null]),
    }));

    assignAnnotations();
  });

  function assignAnnotations() {
    if (!xScale) {
      annotAssignments = GREEN_LINE_EXTENSION_ANNOTATIONS.map(() => ({ row: 0, boxW: 100, fullLabel: '' }));
      return;
    }
    const rowEnds = new Array(5).fill(-Infinity);
    annotAssignments = GREEN_LINE_EXTENSION_ANNOTATIONS.map(a => {
      const fullLabel = `${a.year}: ${a.label}`;
      const boxW = fullLabel.length * 5.6 + 14;
      const ax = xScale(a.year);
      const left = ax - boxW / 2;
      const right = ax + boxW / 2;
      let r = 0;
      while (r < 4 && rowEnds[r] > left - 6) r++;
      rowEnds[r] = right;
      return { row: r, boxW, fullLabel };
    });
  }

  function toggleZip(zip) {
    const s = new Set(selectedZips);
    s.has(zip) ? s.delete(zip) : s.add(zip);
    selectedZips = s;
  }

  function toggleLegendCity(city) {
    const s = new Set(selectedCities);
    s.has(city) ? s.delete(city) : s.add(city);
    selectedCities = s;
  }

  $: anySelected = selectedZips.size > 0 || selectedCities.size > 0;

  function getLineColor(city) {
    const [r, g, b] = CITY_BASE_COLORS[city] ?? [100, 100, 100];
    return `rgb(${r},${g},${b})`;
  }

  function zipStrToNum(zipStr) {
    return parseInt(zipStr, 10);
  }

  function startYearDrag(e) {
    isDraggingYear = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onYearDrag(e) {
    if (!isDraggingYear) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = e.clientX - rect.left - LC_MARGIN.left;
    const rawYear = Math.round(xScale.invert(svgX));
    const newYear = Math.max(YEARS[0], Math.min(YEARS[YEARS.length - 1], rawYear));
    currentYear.set(newYear);
  }

  function stopYearDrag() {
    isDraggingYear = false;
  }

  function handleLineMouseMove(e, d) {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const svgX = e.clientX - rect.left - LC_MARGIN.left;
    const yr = Math.round(xScale.invert(svgX));
    const val = d.values[String(yr)] ?? null;
    lineTooltip = {
      visible: true,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 30,
      zip: d.zip,
      city: d.city,
      value: fmt(val),
      yr,
    };
  }

  function handleLineMouseLeave() {
    lineTooltip = { ...lineTooltip, visible: false };
  }

  function fmt(v) {
    if (v == null) return 'No data';
    return '$' + d3.format(',.0f')(v);
  }
</script>

{#if !loading}
<div class="chart-wrap">
  <h2>Home Values Over Time by ZIP Code</h2>
  <svg width={TOTAL_W} height={370} class="line-chart"
    on:pointermove={onYearDrag}
    on:pointerup={stopYearDrag}
    on:pointerleave={stopYearDrag}
  >
    <g transform="translate({LC_MARGIN.left},{LC_MARGIN.top})">

      <!-- Green Line Extension Milestone annotations -->
      {#each GREEN_LINE_EXTENSION_ANNOTATIONS as a, i}
        {@const info = annotAssignments[i]}
        {@const ax = xScale(a.year)}
        {@const ay = ANNOT_ROW_Y[info.row]}
        {@const isEvent = a.type === 'event'}
        <line x1={ax} x2={ax} y1={ay + 18} y2={LC_H}
          stroke={isEvent ? '#f87171' : '#6fcf97'}
          stroke-width="1" stroke-dasharray="4,3" opacity="0.6" />
        <rect x={ax - info.boxW / 2} y={ay} width={info.boxW} height={16} rx="3"
          fill={isEvent ? '#7f1d1d' : '#1a4a2e'} opacity="0.88" />
        <text x={ax} y={ay + 11} text-anchor="middle" font-size="9"
          fill={isEvent ? '#fca5a5' : '#6fcf97'}>{info.fullLabel}</text>
      {/each}

      <!-- Grid lines -->
      {#each yScale.ticks(5) as tick}
        <line x1={0} x2={LC_W} y1={yScale(tick)} y2={yScale(tick)} stroke="currentColor" stroke-width="1" opacity="0.15" />
        <text x={-8} y={yScale(tick) + 4} text-anchor="end" font-size="10" fill="currentColor">
          {tick >= 1e6 ? '$' + (tick/1e6).toFixed(1) + 'M' : '$' + d3.format(',.0f')(tick)}
        </text>
      {/each}

      <!-- X axis ticks -->
      {#each YEARS.filter(y => y % 5 === 0) as yr}
        <text x={xScale(yr)} y={LC_H + 20} text-anchor="middle" font-size="10" fill="currentColor">{yr}</text>
        <line x1={xScale(yr)} x2={xScale(yr)} y1={LC_H} y2={LC_H + 5} stroke="currentColor" opacity="0.4" />
      {/each}

      <!-- Axis lines -->
      <line x1={0} x2={LC_W} y1={LC_H} y2={LC_H} stroke="currentColor" opacity="0.4" />
      <line x1={0} x2={0} y1={0} y2={LC_H} stroke="currentColor" opacity="0.4" />

      <!-- Lines per ZIP -->
      {#each lineData as d}
        <path
          d={lineGen(d.points)}
          fill="none"
          stroke={getLineColor(d.city)}
          stroke-width={anySelected ? (selectedZips.has(zipStrToNum(d.zip)) || selectedCities.has(d.city) ? 3 : 1.5) : 1.5}
          opacity={anySelected ? (selectedZips.has(zipStrToNum(d.zip)) || selectedCities.has(d.city) ? 1 : 0.12) : 0.8}
          role="button"
          aria-label="{d.zip}"
          tabindex="0"
          style="cursor:pointer"
          on:mousemove={(e) => handleLineMouseMove(e, housingByZip[d.zip])}
          on:mouseleave={handleLineMouseLeave}
          on:click={() => toggleZip(zipStrToNum(d.zip))}
          on:keydown={(e) => e.key === 'Enter' && toggleZip(zipStrToNum(d.zip))}
        />
      {/each}

      <!-- Current year indicator (draggable) -->
      <line
        x1={xScale($currentYear)} x2={xScale($currentYear)}
        y1={0} y2={LC_H}
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"
        pointer-events="none"
      />
      <!-- Drag handle -->
      <rect
        x={xScale($currentYear) - 6} y={0} width={12} height={LC_H}
        fill="transparent"
        style="cursor:ew-resize"
        on:pointerdown={startYearDrag}
      />
      <text x={xScale($currentYear) + 4} y={-6} text-anchor="start" font-size="10" font-weight="bold" fill="currentColor">{$currentYear}</text>

      <!-- Line tooltip -->
      {#if lineTooltip.visible}
        <foreignObject
          x={lineTooltip.x - LC_MARGIN.left}
          y={lineTooltip.y - LC_MARGIN.top}
          width="150" height="60">
          <div class="tooltip">
            <strong>{lineTooltip.city} {lineTooltip.zip}</strong>
            <div>{lineTooltip.yr} · {lineTooltip.value}</div>
          </div>
        </foreignObject>
      {/if}
    </g>
  </svg>
</div>
{/if}

<style>
  .chart-wrap {
    margin: 1.5rem 0;
  }

  h2 {
    margin-bottom: 0.2rem;
  }

  svg {
    display: block;
    border: 1px solid light-dark(#ddd, #444);
    border-radius: 8px;
    background: light-dark(#f0f0f0, #1e1e1e);
    cursor: grab;
  }

  svg:active {
    cursor: grabbing;
  }

  .tooltip {
    background: rgba(0,0,0,0.82);
    color: #fff;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 12px;
    line-height: 1.6;
    pointer-events: none;
  }
</style>
