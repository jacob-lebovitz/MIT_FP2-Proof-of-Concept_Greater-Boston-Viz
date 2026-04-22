<script>
// test comment for action
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  export let year = 2011;
  export let hideSlider = false;
  export let hideHeader = false;

  const WIDTH = 680;
  const HEIGHT = 500;
  const MAP_W = 460;
  const LEGEND_X = MAP_W + 10;
  const LEGEND_W = 180;
  const TOTAL_W = LEGEND_X + LEGEND_W + 10;

  const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

  // Matches ZipcodeMap.svelte
  const CITY_BASE_COLORS = {
    Cambridge: [37, 99, 235],
    Somerville: [234, 88, 12],
    Medford: [22, 163, 74],
  };

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

  // Developments with year_created <= year
  $: visibleDevs = developments
    .filter(d => d.year_created <= year && projection)
    .map(d => {
      const p = projection([d.lon, d.lat]);
      return p ? { ...d, cx: p[0], cy: p[1] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.units - a.units);

  $: maxUnits = d3.max(developments, d => d.units) ?? 1;
  $: radiusScale = d3.scaleSqrt().domain([1, maxUnits]).range([2.5, 16]);

  function cityRgb(city) {
    const [r, g, b] = CITY_BASE_COLORS[city] ?? [120, 120, 120];
    return `rgb(${r},${g},${b})`;
  }

  function handleDevMouseMove(e, d) {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    tooltip = {
      visible: true,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top - 50,
      html:
        `<strong>${d.name || 'Unnamed'}</strong>` +
        `<div>${d.city} · ${d.zip}</div>` +
        `<div>${d.units} units${d.affordable_units ? ` (${d.affordable_units} affordable)` : ''}</div>` +
        `<div>Added ${d.year_created}${d.year_completed ? ` · completed ${d.year_completed}` : ''}</div>`,
    };
  }
  function handleDevMouseLeave() { tooltip = { ...tooltip, visible: false }; }

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
  function handleGLMouseLeave() { glTooltip = { ...glTooltip, visible: false }; }

  $: totalUnitsToDate = d3.sum(developments.filter(d => d.year_created <= year), d => d.units);
  $: totalAffordableToDate = d3.sum(developments.filter(d => d.year_created <= year), d => d.affordable_units || 0);
</script>

<div class="map-wrap">
  {#if !hideHeader}
    <h2>New Housing Developments</h2>
    <p class="subtitle">Cambridge · Somerville · Medford &nbsp;·&nbsp; added by {year}</p>
  {/if}

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
        <!-- ZIP context (muted, matches mapped area only) -->
        {#each features as feature}
          <path d={pathGen?.(feature)} fill="#f5f5f5" stroke="#bcc4cf" stroke-width={1 / zoomK} />
        {/each}

        <!-- Green Line (B branch excluded, same as ZipcodeMap) -->
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

        <!-- Development bubbles, colored by city -->
        {#each visibleDevs as d (d.name + d.lat + d.lon + d.year_created)}
          <circle
            cx={d.cx}
            cy={d.cy}
            r={radiusScale(d.units) / Math.sqrt(zoomK)}
            fill={cityRgb(d.city)}
            fill-opacity="0.55"
            stroke={cityRgb(d.city)}
            stroke-width={1 / zoomK}
            role="button"
            aria-label={d.name}
            tabindex="0"
            on:mousemove={(e) => handleDevMouseMove(e, d)}
            on:mouseleave={handleDevMouseLeave}
          />
        {/each}
      </g>

      <!-- Compact legend with small-caps section labels -->
      <g transform="translate({LEGEND_X}, 20)">
        <text class="legend-label" font-size="10" fill="currentColor">CITY</text>
        {#each Object.entries(CITY_BASE_COLORS) as [city, [r, g, b]], i}
          <circle cx={9} cy={22 + i * 18} r="6" fill="rgb({r},{g},{b})" fill-opacity="0.7" stroke="rgb({r},{g},{b})" />
          <text x={24} y={26 + i * 18} font-size="11" fill="currentColor">{city}</text>
        {/each}

        <text class="legend-label" font-size="10" fill="currentColor" y={94}>UNITS (AREA)</text>
        {#each [10, 50, 200] as u, i}
          {@const cy = 112 + i * 22}
          <circle cx={12} cy={cy} r={radiusScale(u)} fill="none" stroke="currentColor" stroke-width="1" opacity="0.7" />
          <text x={30} y={cy + 4} font-size="11" fill="currentColor">{u}</text>
        {/each}
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

    <!-- Big-number stat overlay: cumulative projects / units / affordable -->
    <div class="stat-overlay" aria-hidden="true">
      <div class="stat-col">
        <div class="stat-num">{visibleDevs.length}</div>
        <div class="stat-lbl">PROJECTS</div>
      </div>
      <div class="stat-div"></div>
      <div class="stat-col">
        <div class="stat-num">{totalUnitsToDate.toLocaleString()}</div>
        <div class="stat-lbl">UNITS</div>
      </div>
      <div class="stat-div"></div>
      <div class="stat-col">
        <div class="stat-num">{totalAffordableToDate.toLocaleString()}</div>
        <div class="stat-lbl">AFFORDABLE</div>
      </div>
    </div>
  </div>
</div>

<style>
  .map-wrap { margin: 1.5rem 0; }

  .map-svg-wrap { position: relative; display: inline-block; }

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
    display: flex; align-items: center; justify-content: center;
    height: 200px; font-size: 1rem; color: #888;
  }

  h2 { margin-bottom: 0.2rem; }
  .subtitle { color: #888; margin: 0 0 0.75rem; font-size: 0.9rem; }

  .slider-row {
    display: flex; align-items: center; gap: 0.6rem;
    margin-bottom: 0.75rem; font-size: 0.95rem;
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
    padding: 3px 10px; font-size: 0.85rem; cursor: pointer;
    border: 1px solid light-dark(#aaa, #555); border-radius: 4px;
    background: light-dark(white, #2a2a2a); color: inherit;
  }

  circle {
    transition: fill-opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                r 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  circle[role="button"]:hover { fill-opacity: 0.9; cursor: pointer; }

  .legend-label {
    letter-spacing: 0.12em;
    font-weight: 600;
    opacity: 0.75;
  }

  /* Unified tooltip style — matches the ZIP map */
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

  /* Big-number stat overlay */
  .stat-overlay {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: stretch;
    gap: 0.85rem;
    padding: 0.55rem 0.9rem;
    background: rgba(30, 30, 40, 0.85);
    color: #e2e8f0;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    font-variant-numeric: tabular-nums;
    z-index: 10;
  }

  .stat-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 3.4rem;
  }

  .stat-num {
    font-size: 1.1rem;
    font-weight: 700;
    color: #93c5fd;
    line-height: 1.1;
  }

  .stat-lbl {
    font-size: 0.62rem;
    letter-spacing: 0.13em;
    color: #94a3b8;
    margin-top: 2px;
  }

  .stat-div {
    width: 1px;
    background: rgba(255,255,255,0.1);
  }
</style>
