<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  export let year = 2025;
  export let hideSlider = false;
  export let hideLineChart = false;
  export let compact = false;            // when true, hides in-SVG legend & milestone box (parent provides them)
  export let showSelectionControl = false;
  export let hideHeader = false;

  const WIDTH = 1100;
  const HEIGHT = 980;
  const MAP_W = compact ? 1100 : 880;    // geographic projection width
  const LEGEND_X = MAP_W + 10;
  const LEGEND_W = compact ? 0 : 200;
  const TOTAL_W = compact ? MAP_W : LEGEND_X + LEGEND_W + 10;

  // Zip codes present in both GeoJSON and housing data
  const ZIP_LABELS = {
    2138: 'Harvard Sq',
    2139: 'Central Sq',
    2140: 'N Cambridge',
    2141: 'E Cambridge',
    2142: 'Kendall Sq',
    2143: 'Union Sq',
    2144: 'Davis Sq',
    2145: 'E Somerville',
    2155: 'Medford',
  };

  // Helper: look up neighborhood name from a zip string like "02138"
  function getNeighborhoodName(zipStr) {
    return ZIP_LABELS[parseInt(zipStr, 10)] ?? zipStr;
  }

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
    Somerville: [220, 38, 38],   // red
    Medford: [202, 138, 4],      // yellow (deep amber for legibility on white)
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
  let selectedZips = new Set();
  let selectedCities = new Set();

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

  function resetSelection() {
    selectedZips = new Set();
    selectedCities = new Set();
  }

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

    if (!compact) {
      d3.select(svgEl).call(zoomBehavior);
    }
  });

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

  const N_BUCKETS = 5;

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
  const LC_SVG_H = 980;
  const LC_MARGIN = { top: 280, right: 126, bottom: 46, left: 70 };
  const LC_W = TOTAL_W - LC_MARGIN.left - LC_MARGIN.right;
  const LC_H = LC_SVG_H - LC_MARGIN.top - LC_MARGIN.bottom;

  const ANNOT_ROW_Y = [-90, -130, -170, -210, -250]; // row 0 = closest to chart

  const GREEN_LINE_EXTENSION_ANNOTATIONS = [
    {
      year: 2005,
      label: 'Conservation Law Foundation sued state',
      type: 'greenLineExtension',
      source: 'Boston Globe timeline',
      headline: 'Lawsuit puts the stalled Green Line Extension back on the state agenda',
    },
    {
      year: 2007,
      label: 'Settlement — commit to finish by 2014',
      type: 'greenLineExtension',
      source: 'Boston Globe timeline',
      headline: 'State commitment follows legal pressure over promised transit mitigation',
    },
    {
      year: 2008,
      label: 'Global Financial Crisis',
      type: 'event',
      source: 'Macro context',
      headline: 'Financial crisis freezes housing markets across the region',
    },
    {
      year: 2012,
      label: 'Construction broke ground',
      type: 'greenLineExtension',
      source: 'Boston Globe timeline',
      headline: 'Green Line Extension construction begins in Somerville and Medford',
    },
    {
      year: 2015,
      label: 'Nearly cancelled ($3B cost overrun)',
      type: 'greenLineExtension',
      source: 'Boston Globe, Aug. 2015',
      headline: 'Green Line extension could cost another $1 billion',
    },
    {
      year: 2017,
      label: 'Redesigned & restarted',
      type: 'greenLineExtension',
      source: 'MBTA / local coverage',
      headline: 'Redesigned Green Line Extension moves forward after cost reset',
    },
    {
      year: 2018,
      label: 'Construction restarted',
      type: 'greenLineExtension',
      source: 'MBTA project updates',
      headline: 'Construction restarts with a design-build team and revised schedule',
    },
    {
      year: 2020,
      label: 'COVID-19 pandemic',
      type: 'event',
      source: 'Macro context',
      headline: 'Pandemic reshapes commuting, construction, and housing demand',
    },
    {
      year: 2022,
      label: 'Union Sq & Medford branch opened',
      type: 'greenLineExtension',
      source: 'Boston Globe, Mar. 2022',
      headline: 'Decades in the making, Green Line Extension to Union Square finally opens',
    },
  ];

  // Greedy row assignment: place each annotation in the lowest row with no overlap
  $: annotAssignments = (() => {
    if (!xScale) return GREEN_LINE_EXTENSION_ANNOTATIONS.map(() => ({ row: 0, boxW: 100, fullLabel: '' }));
    const rowEnds = new Array(5).fill(-Infinity);
    return GREEN_LINE_EXTENSION_ANNOTATIONS.map(a => {
      const fullLabel = `${a.year}: ${a.label}`;
      const boxW = fullLabel.length * 8 + 12;
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

  $: sortedFeatures = [...features].sort((a, b) => {
    const aZipStr = String(a.properties.ZCTA5CE20).padStart(5, '0');
    const bZipStr = String(b.properties.ZCTA5CE20).padStart(5, '0');
    const aIsHovered = hoveredZip === aZipStr;
    const bIsHovered = hoveredZip === bZipStr;
    const aIsSelected = selectedZips.has(a.properties.ZCTA5CE20);
    const bIsSelected = selectedZips.has(b.properties.ZCTA5CE20);
    
    // Sort: hovered last (top), then selected, then normal
    if (aIsHovered && !bIsHovered) return 1;
    if (!aIsHovered && bIsHovered) return -1;
    if (aIsSelected && !bIsSelected) return 1;
    if (!aIsSelected && bIsSelected) return -1;
    return 0;
  });

  $: lineData = housing.map(d => ({
    zip: d.zip,
    city: d.city,
    points: YEARS.map(yr => [yr, d.values[String(yr)] ?? null]),
  }));

  $: lineLabels = (() => {
    if (!yScale || lineData.length === 0) return [];
    const minGap = 36;
    const labels = lineData
      .map(d => {
        const latest = [...d.points].reverse().find(([, val]) => val != null);
        if (!latest) return null;
        return {
          ...d,
          zipNum: zipStrToNum(d.zip),
          y: yScale(latest[1]),
          year: latest[0],
          value: latest[1],
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.y - b.y);

    labels.forEach((label, i) => {
      label.labelY = i === 0 ? Math.max(0, label.y) : Math.max(label.y, labels[i - 1].labelY + minGap);
    });

    const overflow = labels.length ? labels[labels.length - 1].labelY - LC_H : 0;
    if (overflow > 0) {
      labels.forEach(label => {
        label.labelY = Math.max(0, label.labelY - overflow);
      });
    }
    return labels;
  })();

  function getLineColor(city) {
    const [r, g, b] = CITY_BASE_COLORS[city] ?? [100, 100, 100];
    return `rgb(${r},${g},${b})`;
  }

  let isDraggingYear = false;

  function setYearFromPointer(e) {
    const svg = e.currentTarget.closest?.('svg') ?? e.currentTarget;
    const bounds = svg.getBoundingClientRect();
    // SVG uses a viewBox so displayed pixels ≠ viewBox units — scale accordingly
    const scaleX = TOTAL_W / bounds.width;
    const svgX = (e.clientX - bounds.left) * scaleX - LC_MARGIN.left;
    const rawYear = Math.round(xScale.invert(svgX));
    year = Math.max(YEARS[0], Math.min(YEARS[YEARS.length - 1], rawYear));
  }

  function startYearDrag(e) {
    isDraggingYear = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setYearFromPointer(e);
  }

  function onYearDrag(e) {
    if (!isDraggingYear) return;
    setYearFromPointer(e);
  }

  function stopYearDrag() {
    isDraggingYear = false;
  }

  function handleLineMouseMove(e, d) {
    hoveredZip = d.zip;
  }

  function handleLineMouseLeave() {
    hoveredZip = null;
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

<div class="map-wrap" class:with-line-chart={!hideLineChart}>
  {#if !hideHeader}
    {#if hideLineChart}
      <h2>Home Values by ZIP Code</h2>
      <p class="subtitle">Cambridge · Somerville · Medford &nbsp;·&nbsp; {year}</p>
    {:else}
      <h2 class="map-panel-title">Home Values by ZIP Code</h2>
      <p class="subtitle map-subtitle">Cambridge · Somerville · Medford &nbsp;·&nbsp; {year}</p>
    {/if}
  {/if}

  {#if !hideSlider}
    <div class="slider-row">
      <span>Year:</span>
      <input type="range" min={YEARS[0]} max={YEARS[YEARS.length - 1]} step="1" bind:value={year} />
      <strong>{year}</strong>
      <button on:click={resetSelection} disabled={!anySelected}>Clear selections</button>
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
    <!-- Surrounding towns context (no stroke — ZIP zone borders define the boundary) -->
    {#each surroundingFeatures as feature}
      <path d={pathGen?.(feature)} fill="url(#surrounding-hatch)" stroke="none" pointer-events="none"
        opacity={hoveredZip ? 0.35 : 1} />
    {/each}

    <!-- Surrounding town labels -->
    {#each surroundingFeatures as feature}
      {@const c = pathGen?.centroid(feature)}
      {#if c}
        <text
          x={c[0]} y={c[1]}
          text-anchor="middle"
          dominant-baseline="middle"
          font-size={26 / zoomK}
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

    <!-- Study area background mask: covers any surrounding-zone hatch that bleeds into ZIP polygons -->
    {#each features as feature}
      <path d={pathGen?.(feature)} class="study-mask" stroke="none" pointer-events="none" />
    {/each}

    <!-- Map paths: sorted for proper z-ordering (hovered and selected on top) -->
    {#each sortedFeatures as feature (feature.properties.ZCTA5CE20)}
      {@const zip = feature.properties.ZCTA5CE20}
      {@const zipStr = String(zip).padStart(5, '0')}
      {@const isHovered = hoveredZip === zipStr}
      {@const isSelected = selectedZips.has(zip)}
      {@const [cr, cg, cb] = CITY_BASE_COLORS[ZIP_TO_CITY[zip]] ?? [120, 120, 120]}
      <path
        d={pathGen?.(feature)}
        fill={anySelected && !isSelected && !selectedCities.has(ZIP_TO_CITY[zip]) ? '#c8c8c8' : getColor(zip, year)}
        stroke={isHovered || isSelected ? `rgb(${cr},${cg},${cb})` : 'rgba(255,255,255,0.85)'}
        stroke-width={isHovered ? 3.5 / zoomK : isSelected ? 3 / zoomK : 1 / zoomK}
        stroke-linejoin="round"
        opacity={hoveredZip && !isHovered ? 0.35 : 1}
        filter={isSelected && !isHovered ? `drop-shadow(0 0 3px rgba(${cr}, ${cg}, ${cb}, 0.5))` : 'none'}
        role="button"
        aria-label={ZIP_LABELS[zip]}
        tabindex="0"
        on:mousemove={(e) => handleMouseMove(e, feature)}
        on:mouseleave={handleMouseLeave}
        on:click={() => toggleZip(zip)}
        on:keydown={(e) => e.key === 'Enter' && toggleZip(zip)}
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

    <!-- Green Line segments - all future segments shown as translucent -->
    {#each greenLineFeatures.filter(s => s.properties.branch !== 'B') as segment}
      {@const isFuture = segment.properties.year_opened > year}
      <path
        d={pathGen?.(segment)}
        fill="none"
        stroke={BRANCH_COLORS[segment.properties.branch] ?? '#00843D'}
        stroke-width={4.5 / zoomK}
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity={isFuture ? 0.25 : 1}
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
        on:mousemove={(e) => handleGLMouseMove(e, { properties: { name: segment.properties.name, year_opened: '' } })}
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
          role="img"
          aria-label={station.name}
          on:mousemove={(e) => {
            const rect = e.currentTarget.closest('svg').getBoundingClientRect();
            glTooltip = { visible: true, x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 44, text: station.name };
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
          font-size={28 / zoomK}
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
      <text font-size="24" font-weight="bold" fill="currentColor">Home Value</text>
      {#each legendBuckets as [lo, hi], i}
        <rect x={0} y={20 + i * 36} width="24" height="24"
          fill={colorScale(lo + 1)} stroke="#aaa" stroke-width="0.5" />
        <text x={32} y={20 + i * 36 + 18} font-size="22" fill="currentColor">
          {fmtLegend(lo)} – {fmtLegend(hi)}
        </text>
      {/each}
      <rect x={0} y={20 + N_BUCKETS * 36} width="24" height="24"
        fill="url(#nodata-hatch)" stroke="#aaa" stroke-width="0.5" />
      <text x={32} y={20 + N_BUCKETS * 36 + 18} font-size="22" fill="currentColor">No data</text>
      <text font-size="22" font-weight="bold" fill="currentColor" y={20 + (N_BUCKETS + 1) * 36 + 22}>City Labels</text>
      {#each Object.entries(CITY_BASE_COLORS) as [city, [r, g, b]], i}
        <g
          role="button"
          tabindex="0"
          aria-label="Filter {city}"
          style="cursor:pointer"
          on:click={() => toggleLegendCity(city)}
          on:keydown={(e) => e.key === 'Enter' && toggleLegendCity(city)}
        >
          <circle cx={11} cy={20 + (N_BUCKETS + 1) * 36 + 44 + i * 30} r="8"
            fill="rgb({r},{g},{b})"
            stroke={selectedCities.has(city) ? '#000' : 'none'}
            stroke-width="2"
          />
          <text x={32} y={20 + (N_BUCKETS + 1) * 36 + 51 + i * 30} font-size="22"
            fill="currentColor"
            font-weight={selectedCities.has(city) ? 'bold' : 'normal'}
          >{city}</text>
        </g>
      {/each}
    </g>
    {/if}

    <!-- Green Line tooltip -->
    {#if glTooltip.visible}
      <foreignObject x={glTooltip.x} y={glTooltip.y} width="300" height="80">
        <div class="tooltip">
          <strong>🟢 {glTooltip.text}</strong>
        </div>
      </foreignObject>
    {/if}

    <!-- Tooltip -->
    {#if tooltip.visible}
      <foreignObject x={tooltip.x} y={tooltip.y} width="280" height="120">
        <div class="tooltip">
          <strong>{getNeighborhoodName(tooltip.zip)}</strong>
          <div style="font-size:0.9em;opacity:0.75">{tooltip.city} · {tooltip.zip}</div>
          <div>{tooltip.value}</div>
        </div>
      </foreignObject>
    {/if}
  </svg>
  {#if showSelectionControl}
    <button class="selection-control" on:click={resetSelection} disabled={!anySelected}>
      Clear selections
    </button>
  {/if}
  </div>

  <!-- Line chart -->
  {#if !loading && !hideLineChart}
  <div class="line-chart-panel">
  {#if hideHeader}
    <h2>Home Values Over Time by ZIP Code</h2>
  {/if}
  <svg viewBox="0 0 {TOTAL_W} {LC_SVG_H}" preserveAspectRatio="xMidYMid meet" class="line-chart"
    style="width:100%; height:auto; max-height:{LC_SVG_H}px"
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
        <text x={-10} y={yScale(tick) + 7} text-anchor="end" font-size="20" fill="currentColor">
          ${(tick/1e6).toFixed(1)}M
        </text>
      {/each}

      <!-- X axis ticks -->
      {#each YEARS.filter(y => y % 5 === 0) as yr}
        <text x={xScale(yr)} y={LC_H + 30} text-anchor="middle" font-size="20" fill="currentColor">{yr}</text>
        <line x1={xScale(yr)} x2={xScale(yr)} y1={LC_H} y2={LC_H + 5} stroke="currentColor" opacity="0.4" />
      {/each}

      <!-- X axis label -->
      <text x={LC_W / 2} y={LC_H + 58} text-anchor="middle" font-size="20" fill="currentColor" font-weight="500">Year</text>

      <!-- Axis lines -->
      <line x1={0} x2={LC_W} y1={LC_H} y2={LC_H} stroke="currentColor" opacity="0.4" />
      <line x1={0} x2={0} y1={0} y2={LC_H} stroke="currentColor" opacity="0.4" />

      <!-- Visible lines per ZIP (dimmed first, highlighted on top) -->
      {#each lineData as d}
        {@const isLineSelected = selectedZips.has(zipStrToNum(d.zip)) || selectedCities.has(d.city)}
        <path
          d={lineGen(d.points)}
          fill="none"
          stroke={getLineColor(d.city)}
          stroke-width={hoveredZip === d.zip ? 8 : anySelected && isLineSelected ? 6.5 : 3.6}
          opacity={hoveredZip ? (d.zip === hoveredZip ? 1 : 0.14) : anySelected ? (isLineSelected ? 1 : 0.14) : 0.82}
          pointer-events="none"
        />
      {/each}

      <!-- Wide invisible hit-area paths for easy hovering -->
      {#each lineData as d}
        {@const lineZip = zipStrToNum(d.zip)}
        <path
          d={lineGen(d.points)}
          fill="none"
          stroke="transparent"
          stroke-width="22"
          stroke-linecap="round"
          stroke-linejoin="round"
          role="button"
          aria-label="{d.zip}"
          tabindex="0"
          style="cursor:pointer"
          on:mousemove={(e) => handleLineMouseMove(e, housingByZip[d.zip])}
          on:mouseleave={handleLineMouseLeave}
          on:click={() => toggleZip(lineZip)}
          on:keydown={(e) => e.key === 'Enter' && toggleZip(lineZip)}
        />
      {/each}

      <!-- Clickable ZIP labels on the right edge for easier selection -->
      {#each lineLabels as label}
        {@const isLabelSelected = selectedZips.has(label.zipNum) || selectedCities.has(label.city)}
        {@const isLabelHovered = hoveredZip === label.zip}
        <g
          transform="translate({LC_W + 14}, {label.labelY})"
          role="button"
          tabindex="0"
          aria-label="Select ZIP {label.zip}"
          class="line-zip-label"
          on:mouseenter={() => hoveredZip = label.zip}
          on:mouseleave={() => hoveredZip = null}
          on:click={() => toggleZip(label.zipNum)}
          on:keydown={(e) => e.key === 'Enter' && toggleZip(label.zipNum)}
        >
          <line x1={-10} x2={-2} y1={label.y - label.labelY} y2="0"
            stroke={getLineColor(label.city)} stroke-width={isLabelHovered || isLabelSelected ? 1.8 : 1}
            opacity={isLabelHovered || isLabelSelected ? 1 : 0.55} />
          <text
            x="0"
            y="4"
            font-size={isLabelHovered || isLabelSelected ? 24 : 22}
            font-weight={isLabelHovered || isLabelSelected ? 800 : 650}
            fill={getLineColor(label.city)}
            opacity={anySelected ? (isLabelSelected || isLabelHovered ? 1 : 0.35) : 0.95}
          >{getNeighborhoodName(label.zip)}</text>
        </g>
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
        x={xScale(year) - 14} y={0} width={28} height={LC_H}
        fill="transparent"
        style="cursor:ew-resize"
        on:pointerdown={startYearDrag}
      />
      <circle cx={xScale(year)} cy={-3} r="5" fill="currentColor" opacity="0.72" pointer-events="none" />
      <text x={xScale(year) + 6} y={-8} text-anchor="start" font-size="20" font-weight="bold" fill="currentColor">{year}</text>

      <!-- Annotation icons + always-visible labels (all milestones at once) -->
      {#each GREEN_LINE_EXTENSION_ANNOTATIONS as a, i}
        {@const assign = annotAssignments[i]}
        {@const ax = xScale(a.year)}
        {@const isEvent = a.type === 'event'}
        <g class="annot-icon" role="img" aria-label="Milestone annotation">
          <line x1={ax} x2={ax} y1={ANNOT_ROW_Y[assign.row] + 14} y2={-10}
            stroke={isEvent ? '#f87171' : '#6fcf97'} stroke-width="1" opacity="0.45" />
          <rect
            x={ax - assign.boxW / 2}
            y={ANNOT_ROW_Y[assign.row] - 20}
            width={assign.boxW}
            height="28"
            rx="4"
            fill={isEvent ? 'rgba(248,113,113,0.16)' : 'rgba(111,207,151,0.16)'}
            stroke={isEvent ? '#7f1d1d' : '#1a4a2e'}
            stroke-width="1"
            opacity="0.95"
          />
          <text x={ax} y={ANNOT_ROW_Y[assign.row]}
            text-anchor="middle"
            font-size="14"
            font-weight="600"
            fill={isEvent ? '#7f1d1d' : '#1a4a2e'}
          >{assign.fullLabel}</text>
        </g>
      {/each}

    </g>
  </svg>
  </div>
  {/if}
</div>

<style>
  /* Paints a solid background over the study area to hide surrounding-zone hatch bleed */
  .study-mask { fill: light-dark(#fafbfc, #1a1b20); }

  .map-wrap { margin: 1.5rem 0; }

  .map-wrap.with-line-chart {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.1rem 1.35rem;
    align-items: start;
    padding-top: 0.45rem;
  }

  .map-wrap.with-line-chart > .slider-row,
  .map-wrap.with-line-chart > .loading {
    grid-column: 1 / -1;
  }

  .map-panel-title {
    grid-column: 1;
    margin: 0 0 0.2rem;
    font-size: 2.4rem;
    line-height: 1.12;
  }

  .map-wrap.with-line-chart > .map-subtitle {
    grid-column: 1;
    margin: 0 0 0.75rem;
  }

  .map-wrap.with-line-chart > .subtitle,
  .map-wrap.with-line-chart > .slider-row,
  .map-wrap.with-line-chart > .loading {
    grid-column: 1 / -1;
  }

  .map-svg-wrap {
    position: relative;
    display: inline-block;
  }

  .map-wrap.with-line-chart .map-svg-wrap {
    width: 100%;
  }

  .map-wrap.with-line-chart .map-svg-wrap svg {
    max-height: 1020px !important;
  }

  .line-chart-panel {
    min-width: 0;
  }

  .line-chart-panel h2 {
    margin: 0.35rem 0 0.45rem;
    font-size: 2.4rem;
    line-height: 1.12;
  }

  .selection-control {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    z-index: 10;
    padding: 0.35rem 0.65rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    border: 1px solid light-dark(#aaa, #555);
    border-radius: 999px;
    background: light-dark(rgba(255,255,255,0.9), rgba(42,42,42,0.9));
    color: inherit;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 2rem;
    color: #888;
  }

  h2 {
    margin-bottom: 0.2rem;
    font-size: 2.4rem;
    line-height: 1.12;
  }

  .subtitle {
    color: #888;
    margin: 0 0 0.75rem;
    font-size: 1.8rem;
    line-height: 1.25;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
    font-size: 1.8rem;
  }

  input[type=range] { width: 420px; cursor: pointer; }

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
    padding: 8px 18px;
    font-size: 1.6rem;
    cursor: pointer;
    border: 1px solid light-dark(#aaa, #555);
    border-radius: 4px;
    background: light-dark(white, #2a2a2a);
    color: inherit;
  }

  button:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }

  path { 
    cursor: pointer; 
    transition: opacity 0.1s;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  path:focus, path:focus-visible { outline: none; }
  path:hover { opacity: 0.8; stroke-width: 2.5; }

  .tooltip {
    background: rgba(30, 30, 40, 0.92);
    color: #f1f5f9;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 22px;
    line-height: 1.45;
    pointer-events: none;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 14px rgba(0,0,0,0.25);
  }
  .tooltip strong { color: #fff; }

  .line-zip-label {
    cursor: pointer;
    outline: none;
  }

  .line-zip-label text {
    paint-order: stroke;
    stroke: light-dark(#fff, #111318);
    stroke-width: 5px;
    stroke-linejoin: round;
  }

  @media (max-width: 800px) {
    .map-wrap.with-line-chart {
      display: block;
    }

    .line-chart-panel {
      margin-top: 1.5rem;
    }
  }
</style>
