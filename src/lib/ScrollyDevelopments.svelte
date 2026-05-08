<script>
  import DevelopmentsMap from './DevelopmentsMap.svelte';
  import { onMount } from 'svelte';
  import { developmentsYear } from './stores.js';

  let scrollySectionsEl;

  const MAP_YEARS = [2011, 2015, 2020, 2025];
  const ALL_YEARS = Array.from({ length: MAP_YEARS[MAP_YEARS.length - 1] - MAP_YEARS[0] + 1 }, (_, i) => MAP_YEARS[0] + i);

  // Each year now has ONE clear takeaway tied to the Green Line thesis,
  // with a single highlighted stat instead of a wall of numbers.
  const YEAR_NARRATIVES = {
    2011: {
      eyebrow: 'BASELINE',
      title: 'Baseline - pre-Green Line Extension construction',
      body:
        'MassBuilds data begins here. By 2011, there are already 202 development records in scope: about 11,000 total units, including 644 affordable units. Cambridge leads by unit volume, while Somerville leads in project count with smaller infill projects. Medford has minimal activity at this point.',
      stat: { value: '644', label: 'cumulative affordable units by 2011' },
    },
    2015: {
      eyebrow: 'Green Line Extension FALTERS',
      title: 'Green Line Extension falters - pipeline keeps growing',
      body:
        'By 2015 cumulative supply reaches roughly 15,600 units across 248 projects. The prior year includes a large Somerville surge, but 2015 itself adds very little new production. The development pipeline continues, though activity appears cautious while the Green Line Extension faces major uncertainty.',
      stat: { value: '248', label: 'cumulative projects by 2015' },
    },
    2020: {
      eyebrow: 'CONSTRUCTION ON',
      title: 'Construction underway, affordability rises',
      body:
        'Through 2020, the map reaches about 357 projects and roughly 25,900 cumulative units. Somerville drives much of the growth with clustered projects along the projected Green Line Extension corridor. Affordable units grow sharply from 2015 to 2020, consistent with post-2017 inclusionary zoning effects.',
      stat: { value: '3x', label: 'growth in affordable units from 2015 to 2020' },
    },
    2025: {
      eyebrow: 'LINE OPEN',
      title: 'Green Line Extension open - catalog at 390 projects',
      body:
        'With Union Square and the Medford branch open, cumulative totals reach about 390 projects, 28,600 units, and 3,900 affordable units. Cambridge still holds the largest share of total units, while post-opening annual production is lower than peak pre-opening years. The affordable share continues to climb.',
      stat: { value: '14%', label: 'affordable share of cumulative units by 2025' },
    },
  };

  $: activeNarrativeYear = MAP_YEARS.reduce(
    (best, yr) => (yr <= $developmentsYear ? yr : best),
    MAP_YEARS[0]
  );
  $: activeNarrative = YEAR_NARRATIVES[activeNarrativeYear];

  function handleYearChange(e) {
    developmentsYear.set(parseInt(e.target.value, 10));
  }

  const ZONE_VH = 100;

  onMount(() => {
    function handleScroll() {
      if (!scrollySectionsEl) return;
      const rect = scrollySectionsEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;
      const zoneH = (ZONE_VH / 100) * vh;

      const anchors = [
        { scrollPos: zoneH / 2 - vh / 2, year: MAP_YEARS[0] },
        ...MAP_YEARS.slice(1).map((yr, i) => ({
          scrollPos: (i + 1) * zoneH + zoneH / 2 - vh / 2,
          year: yr,
        })),
      ];

      if (rect.top > vh || rect.bottom < 0) return;

      if (scrolled <= anchors[0].scrollPos) {
        developmentsYear.set(anchors[0].year);
        return;
      }
      if (scrolled >= anchors[anchors.length - 1].scrollPos) {
        developmentsYear.set(anchors[anchors.length - 1].year);
        return;
      }
      for (let i = 0; i < anchors.length - 1; i++) {
        if (scrolled >= anchors[i].scrollPos && scrolled <= anchors[i + 1].scrollPos) {
          const t = (scrolled - anchors[i].scrollPos) / (anchors[i + 1].scrollPos - anchors[i].scrollPos);
          developmentsYear.set(Math.round(anchors[i].year + t * (anchors[i + 1].year - anchors[i].year)));
          return;
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // Live cumulative stats for the floating overlay
  let dev_total = 0;
  let dev_units = 0;
  let dev_affordable = 0;
  let dev_share = 0;
  $: {
    // these come straight from the map's overlay, but we want them in the side-panel too
    // computed on the fly from year via fetch in DevelopmentsMap. Skipping replication here.
  }
</script>

<section class="scrolly-fullbleed">
  <div class="map-stage">
    <div class="map-shell">
      <DevelopmentsMap year={$developmentsYear} hideSlider={true} hideHeader={true} compact={true} showSelectionControl={true} />
    </div>

    <!-- Section title at top -->
    <div class="floating-control top-center">
      <div class="control-label">YEAR</div>
      <input
        type="range"
        min={ALL_YEARS[0]}
        max={ALL_YEARS[ALL_YEARS.length - 1]}
        value={$developmentsYear}
        on:input={handleYearChange}
        class="year-scrub"
      />
      <div class="year-big">{$developmentsYear}</div>
    </div>

    <!-- Compact legend -->
    <div class="floating-control side-legend">
      <div class="control-label">CITY (BUBBLE COLOR)</div>
      <div class="lg-row"><span class="dot" style="background:#2563eb"></span> Cambridge</div>
      <div class="lg-row"><span class="dot" style="background:#dc2626"></span> Somerville</div>
      <div class="lg-row"><span class="dot" style="background:#ca8a04"></span> Medford</div>
      <div class="control-label" style="margin-top:0.6rem">UNITS (OUTER AREA)</div>
      <div class="lg-row"><span class="dot lg" style="background:rgba(37,99,235,0.3); border:1px solid #2563eb"></span> total units in project</div>
      <div class="control-label" style="margin-top:0.6rem">AFFORDABLE (INNER)</div>
      <div class="lg-row"><span class="dot teal" style="background:#0f766e"></span> deed-restricted units</div>
      <div class="control-label" style="margin-top:0.6rem">TRANSIT</div>
      <div class="lg-row"><span class="line" style="background:#00843D"></span> Green Line</div>
      <div class="lg-row"><span class="line dashed"></span> Green Line Extension (planned)</div>
      <div class="lg-row"><span class="line" style="background:#DA291C"></span> Red Line</div>
    </div>

    <!-- Narrative overlay -->
    {#if activeNarrative}
      {#key activeNarrativeYear}
        <div class="narrative-overlay">
          <div class="card-eyebrow">{activeNarrative.eyebrow} · {activeNarrativeYear}</div>
          <h2 class="card-title">{activeNarrative.title}</h2>
          <p class="card-body">{activeNarrative.body}</p>
          <div class="card-stat">
            <div class="stat-num">{activeNarrative.stat.value}</div>
            <div class="stat-lbl">{activeNarrative.stat.label}</div>
          </div>
        </div>
      {/key}
    {/if}
  </div>

  <div class="scroll-zones" bind:this={scrollySectionsEl}>
    <div class="zone intro-zone"></div>
    {#each MAP_YEARS.slice(1) as _yr}
      <div class="zone"></div>
    {/each}
  </div>
</section>

<style>
  .scrolly-fullbleed { position: relative; }

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

  .map-shell :global(.map-wrap) { width: 100%; max-width: 1400px; margin: 0; }
  .map-shell :global(.map-svg-wrap) { width: 100%; }
  .map-shell :global(svg) { width: 100% !important; height: auto !important; max-height: calc(100svh - 2rem) !important; cursor: default !important; }
  .map-shell :global(.selection-control) { z-index: 8; }

  /* Move the dev map's stat overlay so it doesn't conflict with our panels */
  .map-shell :global(.stat-overlay) {
    bottom: auto !important;
    top: 6rem !important;
    right: 1.25rem !important;
  }

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
    bottom: 1.25rem;
    right: 1.25rem;
    width: 220px;
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
    width: 18px; height: 18px; border-radius: 50%;
    background: linear-gradient(135deg, #0f766e, #134e4a);
    box-shadow: 0 2px 6px rgba(15,118,110,0.45);
    cursor: pointer;
  }
  .year-scrub::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 50%;
    background: linear-gradient(135deg, #0f766e, #134e4a);
    border: none;
    box-shadow: 0 2px 6px rgba(15,118,110,0.45);
    cursor: pointer;
  }

  .year-big {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f766e;
    min-width: 4ch;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .lg-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    margin-top: 0.18rem;
  }
  .lg-row .dot { width: 10px; height: 10px; border-radius: 50%; }
  .lg-row .dot.lg { width: 14px; height: 14px; }
  .lg-row .dot.teal { width: 8px; height: 8px; }
  .lg-row .line { width: 18px; height: 3px; border-radius: 2px; }
  .lg-row .line.dashed {
    background-image: linear-gradient(to right, #00843D 50%, transparent 50%);
    background-size: 6px 3px;
  }

  .narrative-overlay {
    position: absolute;
    top: 5.9rem;
    left: 1.25rem;
    z-index: 5;
    max-width: 360px;
    max-height: calc(100svh - 7.25rem);
    overflow-y: auto;
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
    color: #0f766e;
    margin-bottom: 0.5rem;
  }

  .card-title {
    margin: 0 0 0.7rem;
    font-size: 1.08rem;
    font-weight: 800;
    line-height: 1.18;
    color: light-dark(#0f172a, #f1f5f9);
  }

  .card-body {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    line-height: 1.5;
    color: light-dark(#334155, #cbd5e1);
  }

  .card-stat {
    display: flex;
    gap: 0.85rem;
    align-items: center;
    padding: 0.52rem 0.7rem;
    background: light-dark(rgba(15,118,110,0.08), rgba(15,118,110,0.18));
    border-left: 4px solid #0f766e;
    border-radius: 5px;
  }

  .stat-num {
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1;
    color: #0f766e;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .stat-lbl {
    font-size: 0.72rem;
    line-height: 1.35;
    color: light-dark(#334155, #cbd5e1);
  }

  .scroll-zones {
    position: relative;
    margin-top: -100svh;
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
