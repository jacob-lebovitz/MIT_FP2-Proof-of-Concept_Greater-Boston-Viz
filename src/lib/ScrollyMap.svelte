<script>
  import ZipcodeMap from './ZipcodeMap.svelte';
  import { onMount } from 'svelte';
  import { currentYear } from './stores.js';

  let scrollySectionsEl;

  // Story checkpoints: each is a "moment" in the Green Line saga
  const MAP_YEARS = [2005, 2012, 2017, 2022, 2025];
  const ALL_YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

  // Narrative tightly scoped to the Green Line thesis. Each card now also
  // surfaces a finding-level callout so the takeaways are distributed.
  const YEAR_NARRATIVES = {
    2005: {
      eyebrow: 'BEFORE THE LINE',
      title: 'Two corridors, two prices',
      body:
        'The Red Line through Cambridge is decades old. Harvard, Porter and Davis Square have already commanded a price premium for years. Along the future Green Line corridor — Union Square, Magoun, Ball Square — prices sit visibly lower. The Conservation Law Foundation has just sued the state for stalling the Green Line Extension, but on the ground, the line’s arrival still feels theoretical.',
      finding: 'Red Line ZIPs already cost $100K+ more than future GLX ZIPs.',
    },
    2012: {
      eyebrow: 'BREAKING GROUND',
      title: 'Construction begins, prices don’t flinch',
      body:
        'Construction officially breaks ground on the Green Line Extension. The corridor is no longer hypothetical — bulldozers are visible. If transit announcements drove home values, this is when we’d expect Somerville to spike. Instead the whole region is still recovering from the 2008 financial crisis, and prices along the future GLX route move in lockstep with everywhere else.',
      finding: 'No measurable GLX premium at groundbreaking — prices move with the regional cycle.',
    },
    2017: {
      eyebrow: 'CRISIS & REDESIGN',
      title: 'Costs spike. Prices spike. But not where you’d expect.',
      body:
        'After the project nearly collapses in 2015 over $3B in cost overruns, GLX is redesigned and restarted in 2017. Prices climb sharply — but the climb is centered on Harvard Square and West Cambridge, areas already served by the Red Line. The future Green Line ZIPs gain less than their Red Line neighbors.',
      finding: 'The 2015–17 boom favors Red Line–served ZIPs over GLX corridor ZIPs.',
    },
    2022: {
      eyebrow: 'OPENING DAY',
      title: 'Union Square. Medford branch. Live.',
      body:
        'March 2022: Union Square opens. December 2022: the Medford branch follows. After two decades of litigation and false starts, the Green Line Extension is real. Prices in Somerville and Medford do rise — but they rise less than Cambridge’s Red Line stations did over the same period.',
      finding: 'GLX ZIPs gain ~30% less than Red Line ZIPs from 2017–2022.',
    },
    2025: {
      eyebrow: 'THREE YEARS IN',
      title: 'The narrative the GLX never delivered',
      body:
        'Three years after opening, GLX neighborhoods remain the most affordable in the immediate study area. Kendall Square — anchored on the Red Line and a tech-hub story — has seen the largest price gains of any ZIP in the dataset. The Green Line Extension simply hasn’t produced the displacement that transit-equity opponents predicted.',
      finding: 'Kendall (Red Line) overtakes everything; GLX corridor stays comparatively affordable.',
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

  // Each scroll-trigger zone is one viewport tall.
  const ZONE_VH = 100;

  onMount(() => {
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
      <ZipcodeMap year={$currentYear} hideSlider={true} hideLineChart={true} compact={true} />
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
      <div class="lg-grad" />
      <div class="lg-grad-labels"><span>low</span><span>high</span></div>
      <div class="control-label" style="margin-top:0.6rem">CITY</div>
      <div class="lg-row"><span class="dot" style="background:#2563eb"></span> Cambridge</div>
      <div class="lg-row"><span class="dot" style="background:#ea580c"></span> Somerville</div>
      <div class="lg-row"><span class="dot" style="background:#16a34a"></span> Medford</div>
      <div class="control-label" style="margin-top:0.6rem">TRANSIT</div>
      <div class="lg-row"><span class="line" style="background:#00843D"></span> Green Line (built)</div>
      <div class="lg-row"><span class="line dashed" style="background:#00843D"></span> GLX (planned)</div>
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
  .map-shell :global(svg) { width: 100% !important; height: auto !important; max-height: calc(100svh - 2rem) !important; }

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

  .lg-grad {
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, #f7fbff, #08306b);
  }
  .lg-grad-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.62rem;
    color: light-dark(#64748b, #94a3b8);
    margin-top: 0.15rem;
  }
  .lg-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    margin-top: 0.18rem;
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
    bottom: 1.5rem;
    left: 1.5rem;
    z-index: 5;
    max-width: 460px;
    background: light-dark(rgba(255,255,255,0.92), rgba(15,17,22,0.92));
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid light-dark(rgba(15,23,42,0.08), rgba(255,255,255,0.08));
    border-radius: 14px;
    padding: 1.4rem 1.6rem;
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
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.015em;
    color: light-dark(#0f172a, #f1f5f9);
  }

  .card-body {
    margin: 0 0 1rem;
    font-size: 0.95rem;
    line-height: 1.65;
    color: light-dark(#334155, #cbd5e1);
  }

  .card-finding {
    display: flex;
    gap: 0.6rem;
    align-items: baseline;
    padding: 0.6rem 0.8rem;
    background: light-dark(rgba(0,132,61,0.08), rgba(0,132,61,0.18));
    border-left: 3px solid #00843D;
    border-radius: 4px;
    font-size: 0.85rem;
    line-height: 1.5;
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
  }

  .zone { height: 100svh; }
  .intro-zone { height: 100svh; }

  @media (max-width: 720px) {
    .narrative-overlay {
      max-width: calc(100% - 2rem);
      left: 1rem;
      right: 1rem;
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
