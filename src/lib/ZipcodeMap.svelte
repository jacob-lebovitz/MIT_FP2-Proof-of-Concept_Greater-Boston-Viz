<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  export let year = 2025;
  export let hideSlider = false;
  export let hideLineChart = false;
  export let compact = false;            // when true, hides in-SVG legend & milestone box (parent provides them)

  const WIDTH = 1100;
  const HEIGHT = 740;
  const MAP_W = compact ? 1100 : 880;    // geographic projection width
  const LEGEND_X = MAP_W + 10;
  const LEGEND_W = compact ? 0 : 200;
  const TOTAL_W = compact ? MAP_W : LEGEND_X + LEGEND_W + 10;

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

  const GREEN_LINE_EXTENSION_MILESTONES = {
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
    'Green Line Extension-D': '#00843D', 'Green Line Extension-E': '#00843D',
  };

  const RED_LINE_COLOR = '#DA291C';

  let features = [];
  let housing = [];
  let loading = true;
  let greenLineFeatures = [];
  let stations = [];
  let surroundingFeatures = [];
  let redLineFeatures = [];
  let redLineStations = [];
  let charlesRiverFeatures = [];
  let projection, pathGen;
  let tooltip = { visible: false, x: 0, y: 0, zip: '', city: '', value: '' };
  let glTooltip = { visible: false, x: 0, y: 0, text: '' };
  let svgEl;
  let zoomTransform = 'translate(0,0) scale(1)';
  let zoomK = 1;
  let zoomBehavior;
  let hoveredZip = null;

  onMount(async () => {
    const [geojson, housingData, glGeojson, stationData, surroundingGeojson, rlGeojson, rlStationData, charlesGeojson] = await Promise.all([
      d3.json(`${base}/target-zip-codes.geojson`),
      d3.json(`${base}/housing.json`),
      d3.json(`${base}/mbta_green_line.geojson`),
      d3.json(`${base}/mbta_green_line_stations.json`),
      d3.json(`${base}/surrounding-context.geojson`),
      d3.json(`${base}/mbta_red_line.geojson`),
      d3.json(`${base}/mbta_red_line_stations.json`),
      d3.json(`${base}/charles_river.geojson`),
    ]);
    features = geojson.features;
    housing = housingData;
    greenLineFeatures = glGeojson.features;
    stations = stationData;
    surroundingFeatures = surroundingGeojson.features;
    redLineFeatures = rlGeojson.features;
    redLineStations = rlStationData;
    charlesRiverFeatures = charlesGeojson.features;
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

  $: visibleGreenLine = greenLineFeatures.filter(f => f.properties.year_opened <= year);
  $: futureGreenLine = greenLineFeatures.filter(f => f.properties.year_opened > year && f.properties.branch !== 'B');
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
  const LC_MARGIN = { top: 60, right: 50, bottom: 40, left: 70 };
  const LC_W = TOTAL_W - LC_MARGIN.left - LC_MARGIN.right;
  const LC_H = 370 - LC_MARGIN.top - LC_MARGIN.bottom;

  const ANNOT_ROW_Y = [-44, -66, -88, -110, -134]; // row 0 = closest to chart

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

  // Greedy row assignment: place each annotation in the lowest row with no overlap
  $: annotAssignments = (() => {
    if (!xScale) return GREEN_LINE_EXTENSION_ANNOTATIONS.map(() => ({ row: 0, boxW: 100, fullLabel: '' }));
    const rowEnds = new Array(5).fill(-Infinity);
    return GREEN_LINE_EXTENSION_ANNOTATIONS.map(a => {
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
  let annotTooltip = { visible: false, x: 0, y: 0, label: '', isEvent: false };
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
    return val != null ? colorScale(val) : 'url(#nodata-hatch)';
  }

  function hasData(zipNum, yr) {
    const zipStr = String(zipNum).padStart(5, '0');
    return housingByZip[zipStr]?.values?.[String(yr)] != null;
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
    </div>
  {/if}

  {#if loading}
    <div class="loading">Loading map data…</div>
  {/if}

  <div class="map-svg-wrap">
  <svg viewBox="0 0 {TOTAL_W} {HEIGHT}" preserveAspectRatio="xMidYMid meet" bind:this={svgEl} style="display:{loading ? 'none' : 'block'}; width:100%; height:auto; max-height:{HEIGHT}px">
    <defs>
      <pattern id="nodata-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="light-dark(#e5e7eb, #2d2d33)" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="light-dark(#9ca3af, #555)" stroke-width="1.2" />
      </pattern>
      <pattern id="surrounding-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
        <rect width="5" height="5" fill="light-dark(#eef0f3, #232328)" />
        <line x1="0" y1="0" x2="0" y2="5" stroke="light-dark(#cbd0d6, #3a3a42)" stroke-width="0.8" />
      </pattern>
    </defs>
    <g transform={zoomTransform}>
    <!-- Surrounding towns context (subtle hatched background) -->
    {#each surroundingFeatures as feature}
      <path d={pathGen?.(feature)} fill="url(#surrounding-hatch)" stroke="light-dark(#b8bdc4, #4a4a52)" stroke-width={0.7 / zoomK} stroke-linejoin="round" pointer-events="none" />
    {/each}

    <!-- Surrounding town labels -->
    {#each surroundingFeatures as feature}
      {@const c = pathGen?.centroid(feature)}
      {#if c}
        <text
          x={c[0]} y={c[1]}
          text-anchor="middle"
          dominant-baseline="middle"
          font-size={13 / zoomK}
          fill="light-dark(#6b7280, #9ca3af)"
          font-weight="500"
          letter-spacing="0.06em"
          paint-order="stroke"
          stroke="light-dark(#eef0f3, #232328)"
          stroke-width={3 / zoomK}
          pointer-events="none"
          style="text-transform: uppercase;"
        >{feature.properties.name}</text>
      {/if}
    {/each}

    <!-- Charles River -->
    {#each charlesRiverFeatures as feature}
      <path d={pathGen?.(feature)} fill="#7dd3fc" fill-opacity="0.45" stroke="#0284c7" stroke-width={0.8 / zoomK} stroke-opacity="0.45" pointer-events="none" />
    {/each}

    <!-- Map paths -->
    {#each features as feature}
      {@const zip = feature.properties.ZCTA5CE20}
      {@const zipStr = String(zip).padStart(5, '0')}
      <path
        d={pathGen?.(feature)}
        fill={getColor(zip, year)}
        stroke={hoveredZip === zipStr ? '#1d4ed8' : 'white'}
        stroke-width={hoveredZip === zipStr ? 2.5 / zoomK : 1.5 / zoomK}
        role="img"
        aria-label={ZIP_LABELS[zip]}
        on:mousemove={(e) => handleMouseMove(e, feature)}
        on:mouseleave={handleMouseLeave}
      />
    {/each}

    <!-- Future Green Line segments (planned but not yet opened) — translucent ghost -->
    {#each futureGreenLine as segment}
      <path
        d={pathGen?.(segment)}
        fill="none"
        stroke="#00843D"
        stroke-width={4.5 / zoomK}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="{8 / zoomK},{5 / zoomK}"
        opacity="0.32"
        pointer-events="none"
      />
    {/each}

    <!-- Green Line segments (B branch orange line commented out for now) -->
    {#each visibleGreenLine.filter(s => s.properties.branch !== 'B') as segment}
      <path
        d={pathGen?.(segment)}
        fill="none"
        stroke={BRANCH_COLORS[segment.properties.branch] ?? '#00843D'}
        stroke-width={4.5 / zoomK}
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
          cx={pos[0]} cy={pos[1]} r={6 / zoomK}
          fill="white"
          stroke={BRANCH_COLORS[station.branch] ?? '#00843D'}
          stroke-width={2.5 / zoomK}
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

    <!-- Red Line segments -->
    {#each redLineFeatures as segment}
      <path
        d={pathGen?.(segment)}
        fill="none"
        stroke={RED_LINE_COLOR}
        stroke-width={4.5 / zoomK}
        stroke-linecap="round"
        stroke-linejoin="round"
        role="img"
        aria-label={segment.properties.name}
        on:mousemove={(e) => handleGLMouseMove(e, { properties: { name: segment.properties.name, year_opened: 'Red Line' } })}
        on:mouseleave={handleGLMouseLeave}
      />
    {/each}

    <!-- Red Line stations -->
    {#each redLineStations as station}
      {@const pos = projection?.([station.lon, station.lat])}
      {#if pos}
        <circle
          cx={pos[0]} cy={pos[1]} r={5 / zoomK}
          fill="white"
          stroke={RED_LINE_COLOR}
          stroke-width={2.5 / zoomK}
          pointer-events="none"
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
          font-size={14 / zoomK}
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

    {#if !compact}
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
      <rect x={0} y={16 + N_BUCKETS * 22} width="18" height="18"
        fill="url(#nodata-hatch)" stroke="#aaa" stroke-width="0.5" />
      <text x={24} y={16 + N_BUCKETS * 22 + 13} font-size="11" fill="currentColor">No data</text>
      <text font-size="11" font-weight="bold" fill="currentColor" y={16 + (N_BUCKETS + 1) * 22 + 16}>City Labels</text>
      {#each Object.entries(CITY_BASE_COLORS) as [city, [r, g, b]], i}
        <circle cx={9} cy={16 + (N_BUCKETS + 1) * 22 + 32 + i * 20} r="6" fill="rgb({r},{g},{b})" />
        <text x={24} y={16 + (N_BUCKETS + 1) * 22 + 37 + i * 20} font-size="11" fill="currentColor">{city}</text>
      {/each}
    </g>
    {/if}

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
  </div>

  <!-- Line chart -->
  {#if !loading && !hideLineChart}
  <h2 style="margin-top:2rem">Home Values Over Time by ZIP Code</h2>
  <svg viewBox="0 0 {TOTAL_W} 370" preserveAspectRatio="xMidYMid meet" class="line-chart"
    style="width:100%; height:auto; max-height:420px"
    on:pointermove={onYearDrag}
    on:pointerup={stopYearDrag}
    on:pointerleave={stopYearDrag}
  >
    <g transform="translate({LC_MARGIN.left},{LC_MARGIN.top})">

      <!-- Green Line Extension Milestone annotation guide lines (subtle) -->
      {#each GREEN_LINE_EXTENSION_ANNOTATIONS as a}
        {@const ax = xScale(a.year)}
        {@const isEvent = a.type === 'event'}
        <line x1={ax} x2={ax} y1={-18} y2={LC_H}
          stroke={isEvent ? '#f87171' : '#6fcf97'}
          stroke-width="1" stroke-dasharray="3,3" opacity="0.25" />
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

      <!-- Visible lines per ZIP (dimmed first, highlighted on top) -->
      {#each lineData as d}
        <path
          d={lineGen(d.points)}
          fill="none"
          stroke={getLineColor(d.city)}
          stroke-width={hoveredZip === d.zip ? 3.5 : 1.5}
          opacity={hoveredZip ? (d.zip === hoveredZip ? 1 : 0.15) : 0.8}
          pointer-events="none"
        />
      {/each}

      <!-- Wide invisible hit-area paths for easy hovering -->
      {#each lineData as d}
        <path
          d={lineGen(d.points)}
          fill="none"
          stroke="transparent"
          stroke-width="14"
          stroke-linecap="round"
          stroke-linejoin="round"
          role="img"
          aria-label="{d.zip}"
          style="cursor:pointer"
          on:mousemove={(e) => handleLineMouseMove(e, housingByZip[d.zip])}
          on:mouseleave={handleLineMouseLeave}
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

      <!-- Annotation hover icons (one per milestone, above the chart) -->
      {#each GREEN_LINE_EXTENSION_ANNOTATIONS as a}
        {@const ax = xScale(a.year)}
        {@const isEvent = a.type === 'event'}
        <g class="annot-icon" style="cursor:help" role="img" aria-label="Milestone annotation"
          on:mousemove={(e) => {
            const rect = e.currentTarget.closest('svg').getBoundingClientRect();
            annotTooltip = {
              visible: true,
              x: e.clientX - rect.left + 12,
              y: e.clientY - rect.top - 16,
              label: `${a.year}: ${a.label}`,
              isEvent,
            };
          }}
          on:mouseleave={() => annotTooltip = { ...annotTooltip, visible: false }}
        >
          <circle cx={ax} cy={-22} r="8" fill="transparent" />
          <circle cx={ax} cy={-22} r="6"
            fill={isEvent ? '#f87171' : '#6fcf97'}
            stroke={isEvent ? '#7f1d1d' : '#1a4a2e'}
            stroke-width="1.5"
            opacity="0.85"
          />
          <text x={ax} y={-19} text-anchor="middle" font-size="9" font-weight="bold"
            fill={isEvent ? '#7f1d1d' : '#1a4a2e'} pointer-events="none">i</text>
        </g>
      {/each}

      <!-- Annotation tooltip -->
      {#if annotTooltip.visible}
        <foreignObject
          x={annotTooltip.x - LC_MARGIN.left}
          y={annotTooltip.y - LC_MARGIN.top}
          width="240" height="50">
          <div class="tooltip annot-tip" class:event={annotTooltip.isEvent}>
            <strong>{annotTooltip.label}</strong>
          </div>
        </foreignObject>
      {/if}

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

  .reset-zoom-btn {
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding: 4px 10px;
    font-size: 0.8rem;
    cursor: pointer;
    border: 1px solid light-dark(#aaa, #555);
    border-radius: 4px;
    background: light-dark(rgba(255,255,255,0.9), rgba(42,42,42,0.9));
    color: inherit;
    z-index: 10;
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
    border: 1px solid light-dark(#e5e7eb, #3a3a42);
    border-radius: 10px;
    background: light-dark(#fafbfc, #1a1b20);
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
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
    background: rgba(30, 30, 40, 0.92);
    color: #f1f5f9;
    padding: 7px 11px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.55;
    pointer-events: none;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 14px rgba(0,0,0,0.25);
  }
  .tooltip strong { color: #fff; }
  .annot-tip { background: #1a4a2e; }
  .annot-tip.event { background: #7f1d1d; }
  .annot-icon:hover circle:nth-child(2) {
    transform-origin: center;
    transform: scale(1.18);
  }
</style>
