<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  const WIDTH = 680;
  const HEIGHT = 500;
  const LEGEND_W = 180;
  const TOTAL_W = WIDTH + LEGEND_W + 20;

  // Zip codes present in both GeoJSON and housing data
  const TARGET_ZIPS = new Set([2138, 2139, 2140, 2141, 2142, 2143, 2144, 2145, 2155]);
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

  const BRANCH_COLORS = {
    Trunk: '#00843D', B: '#E87722', C: '#00B2A9', D: '#DA291C', E: '#7C4D79',
    'GLX-D': '#00843D', 'GLX-E': '#00843D',
  };

  let features = [];
  let housing = [];
  let greenLineFeatures = [];
  let stations = [];
  let projection, pathGen;
  let year = 2025;
  let tooltip = { visible: false, x: 0, y: 0, zip: '', city: '', value: '' };
  let glTooltip = { visible: false, x: 0, y: 0, text: '' };
  let svgEl;
  let zoomTransform = 'translate(0,0) scale(1)';
  let zoomK = 1;

  onMount(async () => {
    const [geojson, housingData, glGeojson, stationData] = await Promise.all([
      d3.json(`${base}/massachusetts-zip-codes.geojson`),
      d3.json(`${base}/housing.json`),
      d3.json(`${base}/mbta_green_line.geojson`),
      d3.json(`${base}/mbta_green_line_stations.json`),
    ]);
    features = geojson.features.filter(f => TARGET_ZIPS.has(f.properties.ZCTA5CE20));
    housing = housingData;
    greenLineFeatures = glGeojson.features;
    stations = stationData;
    projection = d3.geoMercator().fitSize([WIDTH, HEIGHT], { type: 'FeatureCollection', features });
    pathGen = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [WIDTH, HEIGHT]])
      .on('zoom', (event) => {
        const { x, y, k } = event.transform;
        zoomTransform = `translate(${x},${y}) scale(${k})`;
        zoomK = k;
      });

    d3.select(svgEl).call(zoom);
  });

  function resetZoom() {
    d3.select(svgEl).transition().duration(400).call(
      d3.zoom().transform, d3.zoomIdentity
    );
    zoomTransform = 'translate(0,0) scale(1)';
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

  function handleMouseMove(e, feature) {
    const zip = feature.properties.ZCTA5CE20;
    const entry = housingByZip[String(zip).padStart(5, '0')];
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    tooltip = {
      visible: true,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 40,
      zip: String(zip).padStart(5, '0'),
      city: entry?.city ?? '',
      value: fmt(getValue(zip, year)),
    };
  }

  function handleMouseLeave() {
    tooltip = { ...tooltip, visible: false };
  }
</script>

<div class="map-wrap">
  <h2>Home Values by ZIP Code</h2>
  <p class="subtitle">Cambridge · Somerville · Medford &nbsp;·&nbsp; {year}</p>

  <div class="slider-row">
    <span>Year:</span>
    <input type="range" min={YEARS[0]} max={YEARS[YEARS.length - 1]} step="1" bind:value={year} />
    <strong>{year}</strong>
    <button on:click={resetZoom}>Reset zoom</button>
  </div>

  <svg width={TOTAL_W} height={HEIGHT} bind:this={svgEl}>
    <g transform={zoomTransform}>
    <!-- Map paths -->
    {#each features as feature}
      {@const zip = feature.properties.ZCTA5CE20}
      <path
        d={pathGen?.(feature)}
        fill={getColor(zip, year)}
        stroke="white"
        stroke-width="1.5"
        role="img"
        aria-label={ZIP_LABELS[zip]}
        on:mousemove={(e) => handleMouseMove(e, feature)}
        on:mouseleave={handleMouseLeave}
      />
    {/each}

    <!-- Green Line segments -->
    {#each visibleGreenLine as segment}
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
    {#each visibleStations as station}
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

    <!-- Legend -->
    <g transform="translate({WIDTH + 20}, 20)">
      <text font-size="12" font-weight="bold" fill="currentColor">Home Value</text>
      {#each legendBuckets as [lo, hi], i}
        <rect x={0} y={16 + i * 22} width="18" height="18"
          fill={colorScale(lo + 1)} stroke="#aaa" stroke-width="0.5" />
        <text x={24} y={16 + i * 22 + 13} font-size="11" fill="currentColor">
          {lo >= 1e6 ? '$' + (lo/1e6).toFixed(2) + 'M' : '$' + d3.format(',.0f')(lo)} –
          {hi >= 1e6 ? '$' + (hi/1e6).toFixed(2) + 'M' : '$' + d3.format(',.0f')(hi)}
        </text>
      {/each}
      <text font-size="11" font-weight="bold" fill="currentColor" y={16 + N_BUCKETS * 22 + 16}>City Labels</text>
      {#each Object.entries(CITY_BASE_COLORS) as [city, [r, g, b]], i}
        <circle cx={9} cy={16 + N_BUCKETS * 22 + 32 + i * 20} r="6" fill="rgb({r},{g},{b})" />
        <text x={24} y={16 + N_BUCKETS * 22 + 37 + i * 20} font-size="11" fill="currentColor">{city}</text>
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
</div>

<style>
  .map-wrap { margin: 1.5rem 0; }

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
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f0f0f0;
    cursor: grab;
  }

  svg:active { cursor: grabbing; }

  button {
    padding: 3px 10px;
    font-size: 0.85rem;
    cursor: pointer;
    border: 1px solid #aaa;
    border-radius: 4px;
    background: white;
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
