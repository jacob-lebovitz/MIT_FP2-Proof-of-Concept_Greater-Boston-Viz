<script>
  import ZipcodeMap from './ZipcodeMap.svelte';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { currentYear } from './stores.js';

  let scrollySectionsEl;

  // Story checkpoints: each is a "moment" in the Green Line saga
  const MAP_YEARS = [2005, 2012, 2017, 2022, 2025];
  const ALL_YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const N_BUCKETS = 7;
  const PRICE_COLORS = d3.schemeBlues[N_BUCKETS];
  let priceLegendBuckets = [];

  // Narrative tightly scoped to the Green Line thesis. Each card now also
  // surfaces a finding-level callout so the takeaways are distributed.
  const YEAR_NARRATIVES = {
    2005: {
      eyebrow: 'EARLY PATTERNS',
      title: 'Red Line premium, before Green Line Extension momentum',
      body:
        'Initial price increases appear in Harvard Square and Cambridgeport, both already served by the Red Line for decades. The Green Line Extension is not yet a major topic of discussion, and areas around projected Green Line Extension stops do not show notable price increases.',
      finding: 'Price growth is concentrated in established Red Line areas, not projected Green Line Extension stops.',
    },
    2012: {
      eyebrow: 'GROUND BREAKING',
      title: 'Construction starts amid market stagnation',
      body:
        'Construction has broken ground on the Green Line Extension, but there is still no significant price increase around projected stops. More broadly, prices are mostly flat compared with 2005, likely reflecting the lingering effects of the 2008 financial crisis.',
      finding: 'Even with Green Line Extension construction underway, surrounding prices show little distinct acceleration.',
    },
    2017: {
      eyebrow: 'CONSTRUCTION ERA',
      title: 'Prices rise, led by Red Line neighborhoods',
      body:
        'The Green Line Extension remains under construction, and prices rise significantly across the study area. The strongest gains are still in Harvard Square and Cambridgeport, both tied to Red Line access, while projected Green Line Extension-stop areas rise more modestly.',
      finding: 'Regional appreciation is visible, but peak gains remain strongest in Red Line corridors.',
    },
    2022: {
      eyebrow: 'SERVICE OPENS',
      title: 'Green Line Extension active, but hierarchy persists',
      body:
        'The Green Line Extension is now active in all neighborhoods. Prices continue rising, but the highest levels remain in west Cambridge and other established high-demand areas.',
      finding: 'Green Line Extension activation does not immediately overturn the existing Cambridge-led price hierarchy.',
    },
    2025: {
      eyebrow: 'THREE YEARS LATER',
      title: 'Green Line Extension corridors remain relatively less expensive',
      body:
        'With the Green Line Extension active, Somerville and nearby Green Line neighborhoods remain slightly below Harvard Square and west Cambridge on prices. Kendall Square, with strong Red Line access, continues to post especially large gains.',
      finding: 'Even post-Green Line Extension, top-end price escalation remains strongest around Red Line anchors.',
    },
  };

  $: activeNarrativeYear = MAP_YEARS.reduce(
    (best, yr) => (yr <= $currentYear ? yr : best),
    null
  );
  $: activeNarrative = activeNarrativeYear ? YEAR_NARRATIVES[activeNarrativeYear] : null;

  function handleYearChange(e) {
    currentYear.set(parseInt(e.target.value, 10));
  }

  function fmtLegend(v) {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
    return '$' + Math.round(v / 1000) + 'k';
  }

  // Each scroll-trigger zone is one viewport tall.
  const ZONE_VH = 100;

  onMount(() => {
    d3.json(`${base}/housing.json`).then((housing) => {
      const values = housing.flatMap(d => Object.values(d.values));
      const min = d3.min(values) ?? 0;
      const max = d3.max(values) ?? 1;
      priceLegendBuckets = d3.range(N_BUCKETS).map(i => ({
        lo: min + i * (max - min) / N_BUCKETS,
        hi: min + (i + 1) * (max - min) / N_BUCKETS,
        color: PRICE_COLORS[i],
      })).reverse();
    });

    function handleScroll() {
      if (!scrollySectionsEl) return;
      const rect = scrollySectionsEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;
      const zoneH = (ZONE_VH / 100) * vh;

      // anchors: zone 0 (intro/spacer) -> 2000; zone i (i>=1) -> MAP_YEARS[i-1]
      const anchors = [
        { scrollPos: zoneH / 2 - vh / 2, year: 2000 },
        ...MAP_YEARS.map((yr, i) => ({
          scrollPos: (i + 1) * zoneH + zoneH / 2 - vh / 2,
          year: yr,
        })),
      ];

      if (scrolled <= anchors[0].scrollPos) {
        currentYear.set(2000);
        return;
      }
      if (scrolled >= anchors[anchors.length - 1].scrollPos) {
        currentYear.set(anchors[anchors.length - 1].year);
        return;
      }
      for (let i = 0; i < anchors.length - 1; i++) {
        if (scrolled >= anchors[i].scrollPos && scrolled <= anchors[i + 1].scrollPos) {
          const t = (scrolled - anchors[i].scrollPos) / (anchors[i + 1].scrollPos - anchors[i].scrollPos);
          currentYear.set(Math.round(anchors[i].year + t * (anchors[i + 1].year - anchors[i].year)));
          return;
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<section class="scrolly-fullbleed">
  <!-- Sticky map fills the viewport height -->
  <div class="map-stage">
    <div class="map-shell">
      <ZipcodeMap year={$currentYear} hideSlider={true} hideLineChart={true} compact={true} showSelectionControl={true} />
    </div>

    <!-- Floating year scrubber, top -->
    <div class="floating-control top-center">
      <div class="control-label">YEAR</div>
      <input
        type="range"
        min={ALL_YEARS[0]}
        max={ALL_YEARS[ALL_YEARS.length - 1]}
        value={$currentYear}
        on:input={handleYearChange}
        class="year-scrub"
      />
      <div class="year-big">{$currentYear}</div>
    </div>

    <!-- Floating compact legend (right) -->
    <div class="floating-control side-legend">
      <div class="control-label">PRICE</div>
      {#each priceLegendBuckets as bucket}
        <div class="lg-row">
          <span class="swatch" style="background:{bucket.color}"></span>
          {fmtLegend(bucket.lo)} - {fmtLegend(bucket.hi)}
        </div>
      {/each}
      <div class="lg-row">
        <span class="swatch no-data"></span>
        No data
      </div>
      <div class="control-label" style="margin-top:0.6rem">CITY</div>
      <div class="lg-row"><span class="dot" style="background:#2563eb"></span> Cambridge</div>
      <div class="lg-row"><span class="dot" style="background:#dc2626"></span> Somerville</div>
      <div class="lg-row"><span class="dot" style="background:#ca8a04"></span> Medford</div>
      <div class="control-label" style="margin-top:0.6rem">TRANSIT</div>
      <div class="lg-row"><span class="line" style="background:#00843D"></span> Green Line (built)</div>
      <div class="lg-row"><span class="line dashed" style="background:#00843D"></span> Green Line Extension (planned)</div>
      <div class="lg-row"><span class="line" style="background:#DA291C"></span> Red Line</div>
    </div>

    <!-- Active narrative card (overlaid bottom-left) -->
    {#if activeNarrative}
      {#key activeNarrativeYear}
        <div class="narrative-overlay">
          <div class="card-eyebrow">{activeNarrative.eyebrow} · {activeNarrativeYear}</div>
          <h2 class="card-title">{activeNarrative.title}</h2>
          <p class="card-body">{activeNarrative.body}</p>
          <div class="card-finding">
            <span class="finding-pin">FINDING</span>
            {activeNarrative.finding}
          </div>
        </div>
      {/key}
    {/if}
  </div>

  <!-- Invisible scroll-trigger zones (drive the year via scroll position) -->
  <div class="scroll-zones" bind:this={scrollySectionsEl}>
    <div class="zone intro-zone"></div>
    {#each MAP_YEARS as _yr}
      <div class="zone"></div>
    {/each}
  </div>
</section>

<style>
  .scrolly-fullbleed {
    position: relative;
  }

  .map-stage {
    position: sticky;
    top: 0;
    height: 100svh;
    width: 100%;
    overflow: hidden;
  }

  .map-shell {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  /* Make the embedded ZipcodeMap fill its container */
  .map-shell :global(.map-wrap) { width: 100%; max-width: 1400px; margin: 0; }
  .map-shell :global(.map-svg-wrap) { width: 100%; }
  .map-shell :global(svg) { width: 100% !important; height: auto !important; max-height: calc(100svh - 2rem) !important; cursor: default !important; }

  .floating-control {
    position: absolute;
    z-index: 5;
    background: light-dark(rgba(255,255,255,0.78), rgba(20,22,28,0.78));
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid light-dark(rgba(15,23,42,0.08), rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 0.7rem 1rem;
    box-shadow: 0 8px 28px rgba(0,0,0,0.10);
    color: inherit;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .top-center {
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 380px;
  }

  .side-legend {
    top: 50%;
    right: 1.25rem;
    transform: translateY(-50%);
    width: 200px;
  }

  .control-label {
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    font-weight: 700;
    color: light-dark(#475569, #94a3b8);
    margin-bottom: 0.3rem;
  }

  .year-scrub {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: light-dark(#e2e8f0, #334155);
    border-radius: 3px;
    cursor: pointer;
    outline: none;
  }
  .year-scrub::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00843D, #064e3b);
    box-shadow: 0 2px 6px rgba(0,132,61,0.4);
    cursor: pointer;
  }
  .year-scrub::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00843D, #064e3b);
    border: none;
    box-shadow: 0 2px 6px rgba(0,132,61,0.4);
    cursor: pointer;
  }

  .year-big {
    font-size: 1.5rem;
    font-weight: 800;
    color: #00843D;
    min-width: 4ch;
    text-align: center;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .lg-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    margin-top: 0.18rem;
  }
  .lg-row .swatch {
    width: 16px;
    height: 12px;
    border-radius: 3px;
    border: 1px solid rgba(0,0,0,0.18);
    flex-shrink: 0;
  }
  .lg-row .swatch.no-data {
    background:
      repeating-linear-gradient(45deg, transparent 0 4px, rgba(107,114,128,0.55) 4px 6px),
      light-dark(#e5e7eb, #2d2d33);
  }
  .lg-row .dot {
    width: 10px; height: 10px; border-radius: 50%;
  }
  .lg-row .line {
    width: 18px; height: 3px; border-radius: 2px;
  }
  .lg-row .line.dashed {
    background-image: linear-gradient(to right, #00843D 50%, transparent 50%);
    background-size: 6px 3px;
    background-color: transparent !important;
  }

  .narrative-overlay {
    position: absolute;
    top: 5.1rem;
    left: 1.25rem;
    z-index: 5;
    max-width: 360px;
    background: light-dark(rgba(255,255,255,0.92), rgba(15,17,22,0.92));
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid light-dark(rgba(15,23,42,0.08), rgba(255,255,255,0.08));
    border-radius: 12px;
    padding: 0.95rem 1.1rem;
    box-shadow: 0 16px 40px rgba(0,0,0,0.18);
    animation: fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card-eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: #00843D;
    margin-bottom: 0.5rem;
  }

  .card-title {
    margin: 0 0 0.7rem;
    font-size: 1.08rem;
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.015em;
    color: light-dark(#0f172a, #f1f5f9);
  }

  .card-body {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    line-height: 1.5;
    color: light-dark(#334155, #cbd5e1);
  }

  .card-finding {
    display: flex;
    gap: 0.6rem;
    align-items: baseline;
    padding: 0.5rem 0.65rem;
    background: light-dark(rgba(0,132,61,0.08), rgba(0,132,61,0.18));
    border-left: 3px solid #00843D;
    border-radius: 4px;
    font-size: 0.76rem;
    line-height: 1.42;
    color: light-dark(#0f172a, #e2e8f0);
  }

  .finding-pin {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    font-weight: 800;
    color: #00843D;
    flex-shrink: 0;
  }

  .scroll-zones {
    position: relative;
    margin-top: -100svh; /* overlap with sticky map so the first zone reveals it */
    pointer-events: none;
  }

  .zone { height: 100svh; pointer-events: none; }
  .intro-zone { height: 100svh; }

  @media (max-width: 720px) {
    .narrative-overlay {
      max-width: calc(100% - 2rem);
      left: 1rem;
      right: 1rem;
      top: auto;
      bottom: 1rem;
      padding: 1rem 1.1rem;
    }
    .card-title { font-size: 1.15rem; }
    .top-center {
      min-width: 0;
      width: calc(100% - 2rem);
      left: 1rem;
      right: 1rem;
      transform: none;
    }
    .side-legend { display: none; }
  }
</style>
