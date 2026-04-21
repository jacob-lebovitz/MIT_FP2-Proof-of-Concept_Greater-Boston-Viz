<script>
  import DevelopmentsMap from './DevelopmentsMap.svelte';
  import { onMount } from 'svelte';
  import { developmentsYear } from './stores.js';

  let scrollySectionsEl;

  // 5-year checkpoints
  const MAP_YEARS = [2000, 2005, 2010, 2015, 2020, 2025];
  const ALL_YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

  // Placeholder narratives — fill in when you have the final copy
  const YEAR_NARRATIVES = {
    2000: 'PLACEHOLDER — 2000: Baseline. Before the Green Line Extension enters serious planning. Development activity in Cambridge, Somerville, and Medford reflects the pre-GLX pattern.',
    2005: 'PLACEHOLDER — 2005: Conservation Law Foundation sues the state over stalled GLX. MassBuilds records are sparse this early, so most bubbles appear from ~2011 onward.',
    2010: 'PLACEHOLDER — 2010: Early momentum. The MassBuilds dataset begins populating around this year, capturing development proposals in the Green Line corridor.',
    2015: 'PLACEHOLDER — 2015: Project nearly cancelled amid cost overruns, yet new development proposals continue to cluster along the planned GLX corridor.',
    2020: 'PLACEHOLDER — 2020: Construction underway, pandemic begins. Development filings continue along future GLX stops in Somerville and Medford.',
    2025: 'PLACEHOLDER — 2025: GLX fully operational. Cumulative development pattern highlights the GLX corridor relative to the earlier Red Line–anchored Cambridge baseline.',
  };

  $: activeNarrativeYear = MAP_YEARS.reduce(
    (best, yr) => (yr <= $developmentsYear ? yr : best),
    null
  );

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

      // Anchor 0: spacer → first year. Then one anchor per MAP_YEAR section.
      const anchors = [
        { scrollPos: SECTION_HEIGHT / 2 - vh / 2, year: MAP_YEARS[0] },
        ...MAP_YEARS.slice(1).map((yr, i) => ({
          scrollPos: (i + 1) * SECTION_HEIGHT + SECTION_HEIGHT / 2 - vh / 2,
          year: yr,
        })),
      ];

      // Only react when this scrolly is actually in view
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
    {#each MAP_YEARS.slice(1) as yr}
      <section class="year-section" data-year={yr}>
        <div class="narrative-card" class:active={activeNarrativeYear === yr} class:future={yr > $developmentsYear}>
          <div class="narrative-card-year">{yr}</div>
          <p class="narrative-card-text">{YEAR_NARRATIVES[yr]}</p>
        </div>
      </section>
    {/each}
  </div>

  <div class="map-container">
    <div class="map-inner">
      <DevelopmentsMap year={$developmentsYear} hideSlider={true} />

      <div class="year-slider">
        <input
          type="range"
          min={Math.min(...ALL_YEARS)}
          max={Math.max(...ALL_YEARS)}
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
    padding: 1.5rem 2rem;
    border-left: 3px solid light-dark(#ccc, #555);
    opacity: 0.4;
    transition: opacity 0.4s ease, border-color 0.4s ease;
    max-width: 380px;
  }

  .narrative-card.active {
    opacity: 1;
    border-left-color: #2563eb;
  }

  .narrative-card.future {
    opacity: 0;
    pointer-events: none;
  }

  .narrative-card-year {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2563eb;
    margin-bottom: 0.5rem;
  }

  .narrative-card-text {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: light-dark(#333, #ccc);
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
    padding: 0.75rem 1rem;
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
  }

  @media (max-width: 1200px) {
    .scrolly-container { grid-template-columns: 1fr; }
    .map-container { position: static; margin-top: 2rem; }
  }
</style>
