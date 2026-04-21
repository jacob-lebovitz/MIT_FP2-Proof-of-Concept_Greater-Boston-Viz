<script>
  import DevelopmentsMap from './DevelopmentsMap.svelte';
  import { onMount } from 'svelte';
  import { developmentsYear } from './stores.js';

  let scrollySectionsEl;

  // Data begins 2011 (first MassBuilds records in-scope).
  // Checkpoints every ~5 years, ending at the last available data.
  const MAP_YEARS = [2011, 2015, 2020, 2025];
  const ALL_YEARS = Array.from({ length: MAP_YEARS[MAP_YEARS.length - 1] - MAP_YEARS[0] + 1 }, (_, i) => MAP_YEARS[0] + i);

  // Data-grounded narratives. Figures are cumulative through each checkpoint,
  // drawn from static/housing_developments.json (MassBuilds, filtered to the
  // nine ZIPs shown on the map).
  const YEAR_NARRATIVES = {
    2011: {
      title: 'Baseline — pre-GLX construction',
      body:
        'MassBuilds\u2019 catalog begins here. 202 development records are already on the map by 2011: ' +
        '~11,000 total units, just 644 of them affordable. Cambridge dominates by unit volume ' +
        '(6,687 units across 50 projects — big labs & mixed-use near Kendall), while Somerville ' +
        'is already the project-count leader (133 smaller infill buildings). Medford has barely registered. ' +
        'GLX settlement was signed in 2007; construction breaks ground in 2012.',
    },
    2015: {
      title: 'GLX falters — pipeline keeps growing',
      body:
        'By 2015 cumulative supply has reached ~15,600 units / 248 projects. 2014 was a notably large ' +
        'Somerville year (+2,500 units — Assembly Row-era mixed-use). 2015 itself, the year the project ' +
        'was nearly cancelled over $3B cost overruns, adds only 56 units total. The pipeline keeps moving ' +
        'but developers are clearly waiting to see whether the Green Line Extension survives.',
    },
    2020: {
      title: 'Construction underway, affordability rises',
      body:
        'Through 2020 the map shows 357 projects and ~25,900 cumulative units. Somerville is the ' +
        'story: 2016 and 2019 each add ~1,700 units in dozens of smaller projects, clustered along ' +
        'the projected GLX corridor. Affordable units triple between 2015 and 2020 (921 → ~2,900), ' +
        'reflecting post-2017 inclusionary zoning. Medford quietly posts its biggest year in 2020 ' +
        '(1,017 units, 257 of them affordable) — developers positioning for the GLX-E opening.',
    },
    2025: {
      title: 'GLX open — catalog at 390 projects',
      body:
        'Union Square (Mar 2022) and the Medford branch (Dec 2022) are now live. Cumulative totals ' +
        'reach 390 projects, ~28,600 units, ~3,900 affordable. Cambridge holds 50% of unit volume ' +
        'despite having 34% of projects. The post-GLX pipeline has thinned — 2022–2024 combined ' +
        'add fewer units than 2019 alone — but the affordable-unit share keeps climbing, now ~14% of ' +
        'cumulative stock vs. 6% in 2011.',
    },
  };

  $: activeNarrativeYear = MAP_YEARS.reduce(
    (best, yr) => (yr <= $developmentsYear ? yr : best),
    MAP_YEARS[0]
  );

  $: activeIndex = MAP_YEARS.indexOf(activeNarrativeYear);

  function handleYearChange(e) {
    developmentsYear.set(parseInt(e.target.value, 10));
  }

  const SECTION_HEIGHT = 800;

  onMount(() => {
    function handleScroll() {
      if (!scrollySectionsEl) return;
      const rect = scrollySectionsEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;

      const anchors = [
        { scrollPos: SECTION_HEIGHT / 2 - vh / 2, year: MAP_YEARS[0] },
        ...MAP_YEARS.slice(1).map((yr, i) => ({
          scrollPos: (i + 1) * SECTION_HEIGHT + SECTION_HEIGHT / 2 - vh / 2,
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
</script>

<div class="scrolly-container">
  <div class="scrolly-sections" bind:this={scrollySectionsEl}>
    <div class="year-spacer"></div>
    {#each MAP_YEARS as yr, i}
      <section class="year-section" data-year={yr}>
        <div class="narrative-card" class:active={activeNarrativeYear === yr} class:future={yr > $developmentsYear}>
          <div class="card-meta">
            <span class="step">{i + 1} / {MAP_YEARS.length}</span>
            <span class="card-year">{yr}</span>
          </div>
          <h3 class="card-title">{YEAR_NARRATIVES[yr].title}</h3>
          <p class="card-body">{YEAR_NARRATIVES[yr].body}</p>
        </div>
      </section>
    {/each}
  </div>

  <div class="map-container">
    <div class="map-inner">
      <DevelopmentsMap year={$developmentsYear} hideSlider={true} />

      <!-- Scroll step indicator -->
      <div class="step-indicator" aria-hidden="true">
        <span class="step-num">{activeIndex + 1}</span>
        <span class="step-div">/</span>
        <span class="step-tot">{MAP_YEARS.length}</span>
      </div>

      <div class="year-slider">
        <input
          type="range"
          min={ALL_YEARS[0]}
          max={ALL_YEARS[ALL_YEARS.length - 1]}
          value={$developmentsYear}
          on:input={handleYearChange}
          class="slider-input"
        />
        <span class="year-display">{$developmentsYear}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .scrolly-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    position: relative;
  }

  .scrolly-sections { display: flex; flex-direction: column; }

  .year-section {
    min-height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .year-spacer { min-height: 800px; }

  .narrative-card {
    padding: 1.5rem 1.75rem;
    border-left: 3px solid light-dark(#ccc, #555);
    opacity: 0.35;
    transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 420px;
    transform: translateX(-4px);
  }

  .narrative-card.active {
    opacity: 1;
    border-left-color: #2563eb;
    transform: translateX(0);
  }

  .narrative-card.future {
    opacity: 0;
    pointer-events: none;
  }

  .card-meta {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
  }

  .step {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: light-dark(#64748b, #94a3b8);
    font-weight: 600;
  }

  .card-year {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2563eb;
    line-height: 1;
  }

  .card-title {
    margin: 0 0 0.5rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: light-dark(#0f172a, #e2e8f0);
    line-height: 1.3;
  }

  .card-body {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.65;
    color: light-dark(#334155, #cbd5e1);
  }

  .map-container {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }

  .map-inner {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .step-indicator {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    display: flex;
    align-items: baseline;
    gap: 0.2rem;
    background: rgba(30, 30, 40, 0.85);
    color: #e2e8f0;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-variant-numeric: tabular-nums;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .step-indicator .step-num {
    font-weight: 700;
    color: #93c5fd;
    font-size: 0.95rem;
  }

  .step-indicator .step-div { opacity: 0.5; }

  .year-slider {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: light-dark(rgba(255, 255, 255, 0.55), rgba(42, 42, 42, 0.9));
    border: 1px solid light-dark(rgba(0, 0, 0, 0.08), #555);
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    backdrop-filter: blur(6px);
    color: inherit;
  }

  .slider-input {
    width: 200px;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(to right, #ddd 0%, #ddd 100%);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
  }

  .slider-input::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    cursor: pointer; border: none;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
  }

  .year-display {
    font-size: 1rem;
    font-weight: 700;
    color: #2563eb;
    min-width: 40px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 1200px) {
    .scrolly-container { grid-template-columns: 1fr; }
    .map-container { position: static; margin-top: 2rem; }
  }
</style>
