<script>
  import ZipcodeMap from './ZipcodeMap.svelte';
  import { onMount } from 'svelte';
  import { currentYear } from './stores.js';

  let scrollySectionsEl;

  const MAP_YEARS = [2005, 2012, 2017, 2021, 2022, 2025];
  const ALL_YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);
  const YEAR_NARRATIVES = {
    2005: 'Initial price increases shown in the Harvard Square and Cambridgeport areas. These areas are accessible off the red line which has been in place for decades. The green line extension is not yet a major topic of discussion, and there are no significant price increases around the projected stops.',
    2012: 'Construction has broken ground on the green line extension. We see no significant price increases in the areas around the green line or their projected new stops. We actually see no real significant price increases over 2005 in any neighborhoods. This is unusual stagnation in a housing market and could be related to the 2008 financial crisis.',
    2017: 'The green line extension is still under construction, but we see significant price increases across the board. The price increases are especially significant in the Harvard Square and Cambridgeport areas, which are accessible off the red line. The areas around projected green line stops see relatively less price increases.',
    2021: 'Construction is still underway on green line. Price increases are really only seen in the Harvard Square and West Cambridge areas.',
    2022: 'Green line extension is now active in all neighborhoods. Price increases happen only in these areas, which are still relatively cheaper than west Cambridge.',
    2025: 'With an active green line, prices in Somerville and among the green line stay slightly below the prices in Harvard Square and West Cambridge. Interestingly, Kendall Square, more accessible off the red line, has seen significant price increases.',
  };

  // The active narrative card = most recent MAP_YEAR <= currentYear, or null if none reached
  $: activeNarrativeYear = MAP_YEARS.reduce(
    (best, yr) => (yr <= $currentYear ? yr : best),
    null
  );

  function handleYearChange(e) {
    currentYear.set(parseInt(e.target.value, 10));
  }

  const SECTION_HEIGHT = 800; // must match .year-section min-height in CSS

  onMount(() => {
    function handleScroll() {
      if (!scrollySectionsEl) return;
      const rect = scrollySectionsEl.getBoundingClientRect();
      const scrolled = -rect.top;
      const vh = window.innerHeight;

      // Spacer section (index 0) anchors year 2000.
      // MAP_YEARS sections follow after the spacer (offset by 1).
      const anchors = [
        { scrollPos: SECTION_HEIGHT / 2 - vh / 2, year: 2000 },
        ...MAP_YEARS.map((yr, i) => ({
          scrollPos: (i + 1) * SECTION_HEIGHT + SECTION_HEIGHT / 2 - vh / 2,
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

<!-- MAP SECTION -->
<div class="scrolly-container">
  <div class="scrolly-sections" bind:this={scrollySectionsEl}>
    <!-- spacer: gives scroll room for years 2000–2004 before first narrative -->
    <div class="year-spacer"></div>
    {#each MAP_YEARS as yr}
      <section class="year-section" data-year={yr}>
        <div class="narrative-card" class:active={activeNarrativeYear === yr} class:future={yr > $currentYear}>
          <div class="narrative-card-year">{yr}</div>
          <p class="narrative-card-text">{YEAR_NARRATIVES[yr]}</p>
        </div>
      </section>
    {/each}
  </div>

  <div class="map-container">
    <div class="map-inner">
      <ZipcodeMap year={$currentYear} hideSlider={true} hideLineChart={false} />
      
      <!-- Year slider - overlaid on map -->
      <div class="year-slider">
        <input 
          type="range" 
          min={Math.min(...ALL_YEARS)} 
          max={Math.max(...ALL_YEARS)} 
          value={$currentYear}
          on:input={handleYearChange}
          class="slider-input"
        />
        <span class="year-display">{$currentYear}</span>
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

  .scrolly-sections {
    display: flex;
    flex-direction: column;
  }

  .year-section {
    min-height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .year-spacer {
    min-height: 800px;
  }

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

  .timeline {
    position: absolute;
    bottom: auto;
    top: 270px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 10;
  }

  .timeline-track {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
  }

  .timeline-dot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
  }

  .timeline-dot .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #ccc;
    transition: all 0.2s ease;
  }

  .timeline-dot.active .dot {
    width: 0.75rem;
    height: 0.75rem;
    background-color: #2563eb;
  }

  .timeline-dot:hover .dot {
    background-color: #999;
  }

  .timeline-dot:hover.active .dot {
    background-color: #1d4ed8;
  }

  .year-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #666;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .timeline-dot.active .year-label,
  .timeline-dot:hover .year-label {
    opacity: 1;
  }

  .year-slider {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: light-dark(rgba(255, 255, 255, 0.9), rgba(42, 42, 42, 0.9));
    border: 1px solid light-dark(#aaa, #555);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
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
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
  }

  .slider-input::-webkit-slider-thumb:hover {
    width: 20px;
    height: 20px;
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.5);
  }

  .slider-input::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
    border: none;
  }

  .slider-input::-moz-range-thumb:hover {
    width: 20px;
    height: 20px;
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.5);
  }

  .slider-input::-moz-range-track {
    background: transparent;
    border: none;
  }

  .slider-input::-moz-range-progress {
    background-color: #ddd;
  }

  .year-display {
    font-size: 1rem;
    font-weight: 700;
    color: #2563eb;
    min-width: 40px;
    text-align: center;
  }


  @media (max-width: 1200px) {
    .scrolly-container {
      grid-template-columns: 1fr;
    }

    .map-container {
      position: static;
      margin-top: 2rem;
    }
  }
</style>
