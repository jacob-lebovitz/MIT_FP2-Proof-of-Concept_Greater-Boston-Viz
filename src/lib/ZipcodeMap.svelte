<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  export let year = 2025;
  export let hideSlider = false;
  export let hideLineChart = false;

  const WIDTH = 680;
  const HEIGHT = 500;
  const MAP_W = 460;       // geographic projection width (map content stays left of this)
  const LEGEND_X = MAP_W + 10;
  const LEGEND_W = 180;
  const TOTAL_W = LEGEND_X + LEGEND_W + 10;

  // Zip codes present in both GeoJSON and housing data
const ZIP_LABELS = {
    2138: '02138', 2139: '02139', 2140: '02140', 2141: '02141', 2142: '02142',
    2143: '02143', 2144: '02144', 2145: '02145', 2155: '02155',
  };

  const LABEL_OFFSET = {
    2144: [0, 8],
  };

  const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

  const ZIP_TO_CITY = {
    2138: 'Cambridge', 2139: 'Cambridge', 2140: 'Cambridge', 2141: 'Cambridge', 2142: 'Cambridge',
    2143: 'Somerville', 2144: 'Somerville', 2145: 'Somerville',
    2155: 'Medford',
  };

  const CITY_BASE_COLORS = {
    Cambridge: [37, 99, 235],    // blue
    Somerville: [234, 88, 12],   // orange
    Medford: [22, 163, 74],      // green
  };

  const GLX_MILESTONES = {
    2005: 'Conservation Law Foundation sued the state for stalling the Green Line Extension project.',
    2007: 'Conservation Law Foundation & state settled — commitment to complete Green Line Extension by 2014.',
    2012: 'Green Line Extension construction broke ground.',
    2015: 'Project nearly cancelled after costs ballooned to $3B.',
    2017: 'Green Line Extension redesigned & restarted; design-build contract awarded.',
    2018: 'Construction restarted, targeting December 2021 opening.',
    2022: 'Union Square (Mar) & Medford branch (Dec) opened.',
  };

  const BRANCH_COLORS = {
    Trunk: '#00843D', B: '#E87722', C: '#00B2A9', D: '#DA291C', E: '#7C4D79',
    'GLX-D': '#00843D', 'GLX-E': '#00843D',
  };

  let features = [];
  let housing = [];
  let loading = true;
  let greenLineFeatures = [];
  let stations = [];
  let projection, pathGen;
  let tooltip = { visible: false, x: 0, y: 0, zip: '', city: '', value: '' };
  let glTooltip = { visible: false, x: 0, y: 0, text: '' };
  let svgEl;
  let zoomTransform = 'translate(0,0) scale(1)';
  let zoomK = 1;
  let zoomBehavior;
  let selectedZips = new Set();
  let selectedCities = new Set();
  let hoveredZip = null;

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

  onMount(async () => {
    const [geojson, housingData, glGeojson, stationData] = await Promise.all([
      d3.json(`${base}/target-zip-codes.geojson`),
      d3.json(`${base}/housing.json`),
      d3.json(`${base}/mbta_green_line.geojson`),
      d3.json(`${base}/mbta_green_line_stations.json`),
    ]);
    features = geojson.features;
    housing = housingData;
    greenLineFeatures = glGeojson.features;
    stations = stationData;
    projection = d3.geoMercator().fitExtent([[0, 0], [MAP_W, HEIGHT]], { type: 'FeatureCollection', features });
    pathGen = d3.geoPath().projection(projection);
    loading = false;

    zoomBehavior = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [WIDTH, HEIGHT]])
      .on('zoom', (event) => {
        const { x, y, k } = event.transform;
        zoomTransform = `translate(${x},${y}) scale(${k})`;
        zoomK = k;
      });

    d3.select(svgEl).call(zoomBehavior);
  });

  function resetZoom() {
    d3.select(svgEl).transition().duration(400).call(
      zoomBehavior.transform, d3.zoomIdentity
    );
    zoomTransform = 'translate(0,0) scale(1)';
  }

  function resetSelection() {
    selectedZips = new Set();
    selectedCities = new Set();
  }

  $: visibleGreenLine = greenLineFeatures.filter(f => f.properties.year_opened <= year);
  $: visibleStations = stations.filter(s => s.year_opened <= year);

  function handleGLMouseMove(e, feature) {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const p = feature.properties;
    glTooltip = {
      visible: true,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 44,
      text: `${p.name} (${p.year_opened})`,
    };
  }

  function handleGLMouseLeave() {
    glTooltip = { ...glTooltip, visible: false };
  }

  // All values across all years for a stable domain
  $: allValues = housing.flatMap(d => Object.values(d.values));
  $: globalMin = d3.min(allValues) ?? 0;
  $: globalMax = d3.max(allValues) ?? 1;

  const N_BUCKETS = 7;

  $: thresholds = d3.range(N_BUCKETS - 1).map(i =>
    globalMin + (i + 1) * (globalMax - globalMin) / N_BUCKETS
  );

  $: colorScale = d3.scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeBlues[N_BUCKETS]);

  $: legendBuckets = d3.range(N_BUCKETS).map(i => [
    globalMin + i * (globalMax - globalMin) / N_BUCKETS,
    globalMin + (i + 1) * (globalMax - globalMin) / N_BUCKETS,
  ]).reverse();

  $: housingByZip = Object.fromEntries(housing.map(d => [d.zip, d]));

  // Line chart constants
  const LC_MARGIN = { top: 155, right: 50, bottom: 40, left: 70 };
  const LC_W = TOTAL_W - LC_MARGIN.left - LC_MARGIN.right;
  const LC_H = 370 - LC_MARGIN.top - LC_MARGIN.bottom;

  const ANNOT_ROW_Y = [-44, -66, -88, -110, -134]; // row 0 = closest to chart

  const GLX_ANNOTATIONS = [
    { year: 2005, label: 'Conservation Law Foundation sued state', type: 'glx' },
    { year: 2007, label: 'Settlement — commit to finish by 2014', type: 'glx' },
    { year: 2008, label: 'Global Financial Crisis', type: 'event' },
    { year: 2012, label: 'Construction broke ground', type: 'glx' },
    { year: 2015, label: 'Nearly cancelled ($3B cost overrun)', type: 'glx' },
    { year: 2017, label: 'Redesigned & restarted', type: 'glx' },
    { year: 2018, label: 'Construction restarted', type: 'glx' },
    { year: 2020, label: 'COVID-19 pandemic', type: 'event' },
    { year: 2022, label: 'Union Sq & Medford branch opened', type: 'glx' },
  ];

  // Greedy row assignment: place each annotation in the lowest row with no overlap
  $: annotAssignments = (() => {
    if (!xScale) return GLX_ANNOTATIONS.map(() => ({ row: 0, boxW: 100, fullLabel: '' }));
    const rowEnds = new Array(5).fill(-Infinity);
    return GLX_ANNOTATIONS.map(a => {
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
  })();

  $: xScale = d3.scaleLinear().domain([YEARS[0], YEARS[YEARS.length - 1]]).range([0, LC_W]);
  $: yScale = d3.scaleLinear().domain([globalMin * 0.95, globalMax * 1.05]).range([LC_H, 0]);

  $: lineGen = d3.line()
    .x(([yr]) => xScale(yr))
    .y(([, val]) => yScale(val))
    .defined(([, val]) => val != null);

  $: lineData = housing.map(d => ({
    zip: d.zip,
    city: d.city,
    points: YEARS.map(yr => [yr, d.values[String(yr)] ?? null]),
  }));

  function getLineColor(city) {
    const [r, g, b] = CITY_BASE_COLORS[city] ?? [100, 100, 100];
    return `rgb(${r},${g},${b})`;
  }

  let lineTooltip = { visible: false, x: 0, y: 0, zip: '', city: '', value: '' };
  let isDraggingYear = false;

  function startYearDrag(e) {
    isDraggingYear = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onYearDrag(e) {
    if (!isDraggingYear) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = e.clientX - rect.left - LC_MARGIN.left;
    const rawYear = Math.round(xScale.invert(svgX));
    year = Math.max(YEARS[0], Math.min(YEARS[YEARS.length - 1], rawYear));
  }

  function stopYearDrag() {
    isDraggingYear = false;
  }

  function handleLineMouseMove(e, d) {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const svgX = e.clientX - rect.left - LC_MARGIN.left;
    const yr = Math.round(xScale.invert(svgX));
    const val = d.values[String(yr)] ?? null;
    hoveredZip = d.zip;
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
    hoveredZip = null;
    lineTooltip = { ...lineTooltip, visible: false };
  }

  function zipStrToNum(zipStr) {
    return parseInt(zipStr, 10);
  }

  function getColor(zipNum, yr) {
    const zipStr = String(zipNum).padStart(5, '0');
    const entry = housingByZip[zipStr];
    const val = entry?.values?.[String(yr)];
    return val != null ? colorScale(val) : '#ccc';
  }

  function getLabelColor(zipNum) {
    const city = ZIP_TO_CITY[zipNum];
    const [r, g, b] = CITY_BASE_COLORS[city] ?? [255, 255, 255];
    return `rgb(${r},${g},${b})`;
  }

  function getValue(zipNum, yr) {
    const zipStr = String(zipNum).padStart(5, '0');
    return housingByZip[zipStr]?.values?.[String(yr)] ?? null;
  }

  function fmt(v) {
    if (v == null) return 'No data';
    return '$' + d3.format(',.0f')(v);
  }

  function fmtLegend(v) {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
    return '$' + Math.round(v / 1000) + 'k';
  }

  function handleMouseMove(e, feature) {
    const zip = feature.properties.ZCTA5CE20;
    const zipStr = String(zip).padStart(5, '0');
    const entry = housingByZip[zipStr];
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    hoveredZip = zipStr;
    tooltip = {
      visible: true,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 40,
      zip: zipStr,
      city: entry?.city ?? '',
      value: fmt(getValue(zip, year)),
    };
  }

  function handleMouseLeave() {
    hoveredZip = null;
    tooltip = { ...tooltip, visible: false };
  }
</script>

<div class="map-wrap">
  <h2>Home Values by ZIP Code</h2>
  <p class="subtitle">Cambridge · Somerville · Medford &nbsp;·&nbsp; {year}</p>

  {#if !hideSlider}
    <div class="slider-row">
      <span>Year:</span>
      <input type="range" min={YEARS[0]} max={YEARS[YEARS.length - 1]} step="1" bind:value={year} />
      <strong>{year}</strong>
      <button on:click={resetZoom}>Reset zoom</button>
      <button on:click={resetSelection} disabled={!anySelected}>Reset selection</button>
    </div>
  {/if}

  {#if loading}
    <div class="loading">Loading map data…</div>
  {/if}

  <div class="map-svg-wrap">
  <svg width={TOTAL_W} height={HEIGHT} bind:this={svgEl} style="display:{loading ? 'none' : 'block'}">
    <g transform={zoomTransform}>
    <!-- Map paths -->
    {#each features as feature}
      {@const zip = feature.properties.ZCTA5CE20}
      {@const zipStr = String(zip).padStart(5, '0')}
      <path
        d={pathGen?.(feature)}
        fill={anySelected && !selectedZips.has(zip) && !selectedCities.has(ZIP_TO_CITY[zip]) ? '#c8c8c8' : getColor(zip, year)}
        stroke={hoveredZip === zipStr ? '#1d4ed8' : selectedZips.has(zip) ? 'black' : 'white'}
        stroke-width={hoveredZip === zipStr ? 3 / zoomK : selectedZips.has(zip) ? 6 / zoomK : 1.5 / zoomK}
        opacity={hoveredZip ? (hoveredZip === zipStr ? 1 : 0.35) : 1}
        role="button"
        aria-label={ZIP_LABELS[zip]}
        tabindex="0"
        on:mousemove={(e) => handleMouseMove(e, feature)}
        on:mouseleave={handleMouseLeave}
        on:click={() => toggleZip(zip)}
        on:keydown={(e) => e.key === 'Enter' && toggleZip(zip)}
      />
    {/each}

    <!-- Green Line segments (B branch orange line commented out for now) -->
    {#each visibleGreenLine.filter(s => s.properties.branch !== 'B') as segment}
      <path
        d={pathGen?.(segment)}
        fill="none"
        stroke={BRANCH_COLORS[segment.properties.branch] ?? '#00843D'}
        stroke-width={3 / zoomK}
        stroke-linecap="round"
        stroke-linejoin="round"
        role="img"
        aria-label={segment.properties.name}
        on:mousemove={(e) => handleGLMouseMove(e, segment)}
        on:mouseleave={handleGLMouseLeave}
      />
    {/each}

    <!-- Green Line stations -->
    {#each visibleStations.filter(s => s.branch !== 'B') as station}
      {@const pos = projection?.([station.lon, station.lat])}
      {#if pos}
        <circle
          cx={pos[0]} cy={pos[1]} r={5 / zoomK}
          fill="white"
          stroke={BRANCH_COLORS[station.branch] ?? '#00843D'}
          stroke-width={2 / zoomK}
          role="img"
          aria-label={station.name}
          on:mousemove={(e) => {
            const rect = e.currentTarget.closest('svg').getBoundingClientRect();
            glTooltip = { visible: true, x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 44, text: `${station.name} (${station.year_opened})` };
          }}
          on:mouseleave={handleGLMouseLeave}
        />
      {/if}
    {/each}

    <!-- ZIP labels -->
    {#each features as feature}
      {@const zip = feature.properties.ZCTA5CE20}
      {@const c = pathGen?.centroid(feature)}
      {#if c}
        <text
          x={c[0] + (LABEL_OFFSET[zip]?.[0] ?? 0)}
          y={c[1] + (LABEL_OFFSET[zip]?.[1] ?? 0)}
          text-anchor="middle"
          dominant-baseline="middle"
          font-size={10 / zoomK}
          fill={getLabelColor(zip)}
          font-weight="bold"
          paint-order="stroke"
          stroke="white"
          stroke-width={3 / zoomK}
          pointer-events="none"
        >{ZIP_LABELS[zip]}</text>
      {/if}
    {/each}

    </g><!-- end zoomable group -->

    <!-- GLX Milestone annotation -->
    {#if GLX_MILESTONES[year]}
      {@const milestoneLines = GLX_MILESTONES[year].match(/.{1,32}(\s|$)/g)?.map(l => l.trim()) ?? []}
      {@const boxH = 28 + milestoneLines.length * 15}
      <g transform="translate({LEGEND_X}, 280)">
        <rect x={0} y={0} width={LEGEND_W} height={boxH}
          rx="5" ry="5"
          fill="#1a4a2e" opacity="0.9" />
        <text x={8} y={16} font-size="10" font-weight="bold" fill="#6fcf97">Green Line Extension Milestone</text>
        {#each milestoneLines as line, i}
          <text x={8} y={32 + i * 15} font-size="10" fill="white">{line}</text>
        {/each}
      </g>
    {/if}

    <!-- Legend -->
    <g transform="translate({LEGEND_X}, 20)">
      <text font-size="12" font-weight="bold" fill="currentColor">Home Value</text>
      {#each legendBuckets as [lo, hi], i}
        <rect x={0} y={16 + i * 22} width="18" height="18"
          fill={colorScale(lo + 1)} stroke="#aaa" stroke-width="0.5" />
        <text x={24} y={16 + i * 22 + 13} font-size="11" fill="currentColor">
          {fmtLegend(lo)} – {fmtLegend(hi)}
        </text>
      {/each}
      <text font-size="11" font-weight="bold" fill="currentColor" y={16 + N_BUCKETS * 22 + 16}>City Labels</text>
      {#each Object.entries(CITY_BASE_COLORS) as [city, [r, g, b]], i}
        <g
          role="button"
          tabindex="0"
          aria-label="Filter {city}"
          style="cursor:pointer"
          on:click={() => toggleLegendCity(city)}
          on:keydown={(e) => e.key === 'Enter' && toggleLegendCity(city)}
        >
          <circle cx={9} cy={16 + N_BUCKETS * 22 + 32 + i * 20} r="6"
            fill="rgb({r},{g},{b})"
            stroke={selectedCities.has(city) ? '#000' : 'none'}
            stroke-width="2"
          />
          <text x={24} y={16 + N_BUCKETS * 22 + 37 + i * 20} font-size="11"
            fill="currentColor"
            font-weight={selectedCities.has(city) ? 'bold' : 'normal'}
          >{city}</text>
        </g>
      {/each}
    </g>

    <!-- Green Line tooltip -->
    {#if glTooltip.visible}
      <foreignObject x={glTooltip.x} y={glTooltip.y} width="240" height="48">
        <div class="tooltip">
          <strong>🟢 {glTooltip.text}</strong>
        </div>
      </foreignObject>
    {/if}

    <!-- Tooltip -->
    {#if tooltip.visible}
      <foreignObject x={tooltip.x} y={tooltip.y} width="170" height="64">
        <div class="tooltip">
          <strong>{tooltip.city} {tooltip.zip}</strong>
          <div>{tooltip.value}</div>
        </div>
      </foreignObject>
    {/if}
  </svg>
  <button class="reset-zoom-btn" on:click={resetZoom}>Reset zoom</button>
  <button class="reset-selection-btn" on:click={resetSelection} disabled={!anySelected}>Reset selection</button>
  </div>

  <!-- Line chart -->
  {#if !loading && !hideLineChart}
  <h2 style="margin-top:2rem">Home Values Over Time by ZIP Code</h2>
  <svg width={TOTAL_W} height={370} class="line-chart"
    on:pointermove={onYearDrag}
    on:pointerup={stopYearDrag}
    on:pointerleave={stopYearDrag}
  >
    <g transform="translate({LC_MARGIN.left},{LC_MARGIN.top})">

      <!-- GLX Milestone annotations -->
      {#each GLX_ANNOTATIONS as a, i}
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

      <!-- Lines per ZIP (dimmed first, highlighted on top) -->
      {#each lineData as d}
        <path
          d={lineGen(d.points)}
          fill="none"
          stroke={getLineColor(d.city)}
          stroke-width={hoveredZip ? (d.zip === hoveredZip ? 3.5 : 1) : anySelected ? (selectedZips.has(zipStrToNum(d.zip)) || selectedCities.has(d.city) ? 3 : 1.5) : 1.5}
          opacity={hoveredZip ? (d.zip === hoveredZip ? 1 : 0.1) : anySelected ? (selectedZips.has(zipStrToNum(d.zip)) || selectedCities.has(d.city) ? 1 : 0.12) : 0.8}
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
        x1={xScale(year)} x2={xScale(year)}
        y1={0} y2={LC_H}
        stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"
        pointer-events="none"
      />
      <!-- Drag handle (invisible wide rect over full line) -->
      <rect
        x={xScale(year) - 6} y={0} width={12} height={LC_H}
        fill="transparent"
        style="cursor:ew-resize"
        on:pointerdown={startYearDrag}
      />
      <text x={xScale(year) + 4} y={-6} text-anchor="start" font-size="10" font-weight="bold" fill="currentColor">{year}</text>

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
  {/if}
</div>

<style>
  .map-wrap { margin: 1.5rem 0; }

  .map-svg-wrap {
    position: relative;
    display: inline-block;
  }

  .reset-zoom-btn,
  .reset-selection-btn {
    position: absolute;
    bottom: 10px;
    padding: 4px 10px;
    font-size: 0.8rem;
    cursor: pointer;
    border: 1px solid light-dark(#aaa, #555);
    border-radius: 4px;
    background: light-dark(rgba(255,255,255,0.9), rgba(42,42,42,0.9));
    color: inherit;
    z-index: 10;
  }

  .reset-zoom-btn { left: 10px; }
  .reset-selection-btn { left: 110px; }
  .reset-selection-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 1rem;
    color: #888;
  }

  h2 { margin-bottom: 0.2rem; }

  .subtitle {
    color: #888;
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  input[type=range] { width: 260px; cursor: pointer; }

  svg {
    display: block;
    border: 1px solid light-dark(#ddd, #444);
    border-radius: 8px;
    background: light-dark(#f0f0f0, #1e1e1e);
    cursor: grab;
  }

  svg:active { cursor: grabbing; }
  svg.line-chart { cursor: default; background: none; border: none; border-radius: 0; }

  button {
    padding: 3px 10px;
    font-size: 0.85rem;
    cursor: pointer;
    border: 1px solid light-dark(#aaa, #555);
    border-radius: 4px;
    background: light-dark(white, #2a2a2a);
    color: inherit;
  }

  path { cursor: pointer; transition: opacity 0.1s; }
  path:hover { opacity: 0.8; stroke-width: 2.5; }

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
