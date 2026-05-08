<script>
// test comment for action
// test 2
// test 3
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  export let year = 2011;
  export let hideSlider = false;
  export let hideHeader = false;
  export let compact = false;

  const WIDTH = 1100;
  const HEIGHT = 740;
  const MAP_W = compact ? 1100 : 880;
  const LEGEND_X = MAP_W + 10;
  const LEGEND_W = compact ? 0 : 200;
  const TOTAL_W = compact ? MAP_W : LEGEND_X + LEGEND_W + 10;

  const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

  // Matches ZipcodeMap.svelte
  const CITY_BASE_COLORS = {
    Cambridge: [37, 99, 235],   // blue
    Somerville: [220, 38, 38],  // red
    Medford: [202, 138, 4],     // yellow (deep amber for legibility on white)
  };

  const BRANCH_COLORS = {
    Trunk: '#00843D', B: '#E87722', C: '#00B2A9', D: '#DA291C', E: '#7C4D79',
    'Green Line Extension-D': '#00843D', 'Green Line Extension-E': '#00843D',
  };
  const RED_LINE_COLOR = '#DA291C';

  let features = [];
  let developments = [];
  let loading = true;
  let greenLineFeatures = [];
  let stations = [];
  let surroundingFeatures = [];
  let redLineFeatures = [];
  let redLineStations = [];
  let charlesRiverFeatures = [];
  let streetData = [];  // New: for street-level detail
  let projection, pathGen;
  let tooltip = { visible: false, x: 0, y: 0, html: '' };
  let glTooltip = { visible: false, x: 0, y: 0, text: '' };
  let svgEl;
  let zoomTransform = 'translate(0,0) scale(1)';
  let zoomK = 1;
  let zoomBehavior;

  onMount(async () => {
    const [geojson, devData, glGeojson, stationData, surroundingGeojson, rlGeojson, rlStationData, charlesGeojson] = await Promise.all([
      d3.json(`${base}/target-zip-codes.geojson`),
      d3.json(`${base}/housing_developments.json`),
      d3.json(`${base}/mbta_green_line.geojson`),
      d3.json(`${base}/mbta_green_line_stations.json`),
      d3.json(`${base}/surrounding-context.geojson`),
      d3.json(`${base}/mbta_red_line.geojson`),
      d3.json(`${base}/mbta_red_line_stations.json`),
      d3.json(`${base}/charles_river.geojson`),
    ]);
    features = geojson.features;
    developments = devData;
    greenLineFeatures = glGeojson.features;
    stations = stationData;
    surroundingFeatures = surroundingGeojson.features;
    redLineFeatures = rlGeojson.features;
    redLineStations = rlStationData;
    charlesRiverFeatures = charlesGeojson.features;
    projection = d3.geoMercator().fitExtent([[0, 0], [MAP_W, HEIGHT]], { type: 'FeatureCollection', features });
    pathGen = d3.geoPath().projection(projection);
    loading = false;

    // Load street data from Overpass API for street-level detail
    try {
      const bbox = '42.35,-71.15,42.43,-71.07'; // Greater Boston area bounding box
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[bbox:${bbox}];(way["highway"~"^(primary|secondary|tertiary|residential|living_street)$"];);out geom;`;
      const response = await fetch(overpassUrl);
      if (response.ok) {
        const data = await response.json();
        // Convert Overpass JSON to GeoJSON
        if (data.elements) {
          streetData = data.elements
            .filter(el => el.type === 'way' && el.geometry)
            .map(way => ({
              type: 'LineString',
              coordinates: way.geometry.map(node => [node.lon, node.lat]),
              properties: { highway: way.tags?.highway || 'road' }
            }));
        }
      }
    } catch (e) {
      console.log('Street data not available, continuing without street layer');
    }

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
        `<div>${d.units} units${d.affordable_units ? ` <span style="color:#5eead4">· ${d.affordable_units} affordable</span>` : ''}</div>` +
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
    <svg viewBox="0 0 {TOTAL_W} {HEIGHT}" preserveAspectRatio="xMidYMid meet" bind:this={svgEl} style="display:{loading ? 'none' : 'block'}; width:100%; height:auto; max-height:{HEIGHT}px">
      <defs>
        <pattern id="dev-surrounding-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="light-dark(#eef0f3, #232328)" />
          <line x1="0" y1="0" x2="0" y2="5" stroke="light-dark(#cbd0d6, #3a3a42)" stroke-width="0.8" />
        </pattern>
      </defs>
      <g transform={zoomTransform}>
        <!-- Surrounding towns context (subtle hatched background) -->
        {#each surroundingFeatures as feature}
          <path d={pathGen?.(feature)} fill="url(#dev-surrounding-hatch)" stroke="light-dark(#b8bdc4, #4a4a52)" stroke-width={0.7 / zoomK} stroke-linejoin="round" pointer-events="none" />
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

        <!-- ZIP context (muted, matches mapped area only) -->
        {#each features as feature}
          <path d={pathGen?.(feature)} fill="light-dark(#fafbfc, #2a2c33)" stroke="light-dark(#d1d5db, #44464f)" stroke-width={1 / zoomK} />
        {/each}

        <!-- Street-level detail layer (subtle underlayer) -->
        {#each streetData as street}
          {@const streetPath = d3.geoPath().projection(projection)}
          <path
            d={streetPath({ type: 'LineString', coordinates: street.coordinates })}
            fill="none"
            stroke="#ddd"
            stroke-width={street.properties.highway === 'primary' ? 1.5 / zoomK : 0.8 / zoomK}
            opacity="0.4"
            pointer-events="none"
          />
        {/each}

        <!-- Future Green Line segments (planned but not yet opened) — solid translucent preview -->
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

        <!-- Green Line (B branch excluded, same as ZipcodeMap) -->
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

        <!-- Development bubbles: outer = total units (city color), inner = affordable units (dark teal) -->
        {#each visibleDevs as d (d.name + d.lat + d.lon + d.year_created)}
          {@const r = radiusScale(d.units) / Math.sqrt(zoomK)}
          {@const aff = d.affordable_units || 0}
          {@const rAff = aff > 0 ? radiusScale(aff) / Math.sqrt(zoomK) : 0}
          <!-- total units -->
          <circle
            cx={d.cx}
            cy={d.cy}
            r={r}
            fill={cityRgb(d.city)}
            fill-opacity="0.30"
            stroke={cityRgb(d.city)}
            stroke-width={1 / zoomK}
            role="button"
            aria-label={d.name}
            tabindex="0"
            on:mousemove={(e) => handleDevMouseMove(e, d)}
            on:mouseleave={handleDevMouseLeave}
          />
          <!-- affordable units (filled inner circle, sized by sqrt of affordable count) -->
          {#if aff > 0}
            <circle
              cx={d.cx}
              cy={d.cy}
              r={rAff}
              fill="#0f766e"
              fill-opacity="0.85"
              stroke="#134e4a"
              stroke-width={0.6 / zoomK}
              pointer-events="none"
            />
          {/if}
        {/each}
      </g>

      {#if !compact}
      <!-- Compact legend with small-caps section labels -->
      <g transform="translate({LEGEND_X}, 20)">
        <text class="legend-label" font-size="10" fill="currentColor">CITY</text>
        {#each Object.entries(CITY_BASE_COLORS) as [city, [r, g, b]], i}
          <circle cx={9} cy={22 + i * 18} r="6" fill="rgb({r},{g},{b})" fill-opacity="0.30" stroke="rgb({r},{g},{b})" />
          <text x={24} y={26 + i * 18} font-size="11" fill="currentColor">{city}</text>
        {/each}

        <text class="legend-label" font-size="10" fill="currentColor" y={94}>UNITS (AREA)</text>
        {#each [10, 50, 200] as u, i}
          {@const cy = 112 + i * 22}
          <circle cx={12} cy={cy} r={radiusScale(u)} fill="none" stroke="currentColor" stroke-width="1" opacity="0.7" />
          <text x={30} y={cy + 4} font-size="11" fill="currentColor">{u}</text>
        {/each}

        <text class="legend-label" font-size="10" fill="currentColor" y={188}>AFFORDABLE UNITS</text>
        <circle cx={12} cy={206} r="6" fill="#0f766e" fill-opacity="0.85" stroke="#134e4a" />
        <text x={30} y={210} font-size="11" fill="currentColor">inner circle</text>
      </g>
      {/if}

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
    {#if !compact}
    <button class="reset-zoom-btn" on:click={resetZoom}>Reset zoom</button>
    {/if}

    <!-- Big-number stat overlay: cumulative projects / units / affordable -->
    <div class="stat-overlay" class:compact aria-hidden="true">
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
    border: 1px solid light-dark(#e5e7eb, #3a3a42);
    border-radius: 10px;
    background: light-dark(#fafbfc, #1a1b20);
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
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
