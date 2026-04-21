<script>
// test comment for action
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  export let year = 2025;
  export let hideSlider = false;

  const WIDTH = 680;
  const HEIGHT = 500;
  const MAP_W = 460;
  const LEGEND_X = MAP_W + 10;
  const LEGEND_W = 180;
  const TOTAL_W = LEGEND_X + LEGEND_W + 10;

  const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

  const BRANCH_COLORS = {
    Trunk: '#00843D', B: '#E87722', C: '#00B2A9', D: '#DA291C', E: '#7C4D79',
    'GLX-D': '#00843D', 'GLX-E': '#00843D',
  };

  let features = [];
  let developments = [];
  let loading = true;
  let greenLineFeatures = [];
  let stations = [];
  let projection, pathGen;
  let tooltip = { visible: false, x: 0, y: 0, html: '' };
  let glTooltip = { visible: false, x: 0, y: 0, text: '' };
  let svgEl;
  let zoomTransform = 'translate(0,0) scale(1)';
  let zoomK = 1;
  let zoomBehavior;

  onMount(async () => {
    const [geojson, devData, glGeojson, stationData] = await Promise.all([
      d3.json(`${base}/target-zip-codes.geojson`),
      d3.json(`${base}/housing_developments.json`),
      d3.json(`${base}/mbta_green_line.geojson`),
      d3.json(`${base}/mbta_green_line_stations.json`),
    ]);
    features = geojson.features;
    developments = devData;
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

  $: visibleGreenLine = greenLineFeatures.filter(f => f.properties.year_opened <= year);
  $: visibleStations = stations.filter(s => s.year_opened <= year);

  // Developments up to current year, positioned via projection
  $: visibleDevs = developments
    .filter(d => d.year_completed <= year && projection)
    .map(d => {
      const p = projection([d.lon, d.lat]);
      return p ? { ...d, cx: p[0], cy: p[1] } : null;
    })
    .filter(Boolean)
    // Render smallest-on-top so big bubbles don't hide singletons
    .sort((a, b) => b.units - a.units);

  // Size scale — sqrt so area is proportional to unit count
  $: maxUnits = d3.max(developments, d => d.units) ?? 1;
  $: radiusScale = d3.scaleSqrt().domain([1, maxUnits]).range([2.5, 18]);

  // Fill by recency vs. current year (newer = more saturated)
  const bubbleFill = '#d946ef';       // magenta/purple
  const bubbleFillOld = '#a78bfa';    // lighter purple

  function devFill(d) {
    const age = year - d.year_completed;
    return age <= 2 ? bubbleFill : bubbleFillOld;
  }

  function handleDevMouseMove(e, d) {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    tooltip = {
      visible: true,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 50,
      html: `<strong>${d.name || 'Unnamed'}</strong>` +
            `<div>${d.municipal}${d.zip ? ' · ' + d.zip : ''}</div>` +
            `<div>${d.units} units (${d.affordable_units} affordable)</div>` +
            `<div>Completed ${d.year_completed}</div>`,
    };
  }
  function handleDevMouseLeave() {
    tooltip = { ...tooltip, visible: false };
  }

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

  // Running totals for legend
  $: totalUnitsThisYear = d3.sum(developments.filter(d => d.year_completed === year), d => d.units);
  $: totalUnitsToDate = d3.sum(developments.filter(d => d.year_completed <= year), d => d.units);
</script>

<div class="map-wrap">
  <h2>New Housing Developments</h2>
  <p class="subtitle">Completed by {year} · {visibleDevs.length} projects · {totalUnitsToDate.toLocaleString()} units</p>

  {#if !hideSlider}
    <div class="slider-row">
      <span>Year:</span>
      <input type="range" min={YEARS[0]} max={YEARS[YEARS.length - 1]} step="1" bind:value={year} />
      <strong>{year}</strong>
      <button on:click={resetZoom}>Reset zoom</button>
    </div>
  {/if}

  {#if loading}
    <div class="loading">Loading developments…</div>
  {/if}

  <div class="map-svg-wrap">
    <svg width={TOTAL_W} height={HEIGHT} bind:this={svgEl} style="display:{loading ? 'none' : 'block'}">
      <g transform={zoomTransform}>
        <!-- Zip context (muted) -->
        {#each features as feature}
          <path d={pathGen?.(feature)} fill="#eef2f7" stroke="#cbd5e1" stroke-width={1 / zoomK} />
        {/each}

        <!-- Green Line (B branch excluded to match ZipcodeMap) -->
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
              cx={pos[0]} cy={pos[1]} r={4 / zoomK}
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

        <!-- Development bubbles -->
        {#each visibleDevs as d (d.name + d.lat + d.lon + d.year_completed)}
          <circle
            cx={d.cx}
            cy={d.cy}
            r={radiusScale(d.units) / Math.sqrt(zoomK)}
            fill={devFill(d)}
            fill-opacity="0.55"
            stroke={devFill(d)}
            stroke-width={1 / zoomK}
            role="button"
            aria-label={d.name}
            tabindex="0"
            on:mousemove={(e) => handleDevMouseMove(e, d)}
            on:mouseleave={handleDevMouseLeave}
          />
        {/each}
      </g><!-- end zoomable group -->

      <!-- Legend -->
      <g transform="translate({LEGEND_X}, 20)">
        <text font-size="12" font-weight="bold" fill="currentColor">Development size (units)</text>
        {#each [10, 50, 200] as u, i}
          {@const cx = 20}
          {@const cy = 40 + i * 44}
          <circle cx={cx} cy={cy} r={radiusScale(u)} fill={bubbleFill} fill-opacity="0.55" stroke={bubbleFill} />
          <text x={cx + 30} y={cy + 4} font-size="11" fill="currentColor">{u} units</text>
        {/each}

        <text font-size="12" font-weight="bold" fill="currentColor" y={180}>Recency</text>
        <circle cx={20} cy={200} r="6" fill={bubbleFill} fill-opacity="0.6" stroke={bubbleFill} />
        <text x={50} y={204} font-size="11" fill="currentColor">Completed ≤ 2 yrs ago</text>
        <circle cx={20} cy={220} r="6" fill={bubbleFillOld} fill-opacity="0.6" stroke={bubbleFillOld} />
        <text x={50} y={224} font-size="11" fill="currentColor">Older</text>

        <text font-size="11" fill="currentColor" y={258}>
          <tspan font-weight="bold">{totalUnitsThisYear.toLocaleString()}</tspan> units completed in {year}
        </text>
        <text font-size="11" fill="currentColor" y={276}>
          <tspan font-weight="bold">{totalUnitsToDate.toLocaleString()}</tspan> units cumulative
        </text>
      </g>

      <!-- Green Line tooltip -->
      {#if glTooltip.visible}
        <foreignObject x={glTooltip.x} y={glTooltip.y} width="240" height="48">
          <div class="tooltip"><strong>🟢 {glTooltip.text}</strong></div>
        </foreignObject>
      {/if}

      <!-- Development tooltip -->
      {#if tooltip.visible}
        <foreignObject x={tooltip.x} y={tooltip.y} width="240" height="100">
          <div class="tooltip">{@html tooltip.html}</div>
        </foreignObject>
      {/if}
    </svg>
    <button class="reset-zoom-btn" on:click={resetZoom}>Reset zoom</button>
  </div>
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
    border: 1px solid light-dark(#ddd, #444);
    border-radius: 8px;
    background: light-dark(#f0f0f0, #1e1e1e);
    cursor: grab;
  }

  svg:active { cursor: grabbing; }

  button {
    padding: 3px 10px;
    font-size: 0.85rem;
    cursor: pointer;
    border: 1px solid light-dark(#aaa, #555);
    border-radius: 4px;
    background: light-dark(white, #2a2a2a);
    color: inherit;
  }

  circle { transition: opacity 0.15s; }
  circle[role="button"]:hover { fill-opacity: 0.85; cursor: pointer; }

  .tooltip {
    background: rgba(0,0,0,0.82);
    color: #fff;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 12px;
    line-height: 1.5;
    pointer-events: none;
  }
</style>
