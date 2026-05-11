<script>
  export let position; // 'before' | 'between' | 'after'
</script>

{#if position === 'before'}
<!-- ============================================================
     NARRATIVE — BEFORE THE VISUALIZATION
     ============================================================ -->

<div class="narrative before">
  <h2>Transit Access Does Not Destroy Neighborhoods</h2>
  <p>
    The following tools allow us to visualize average home value changes over time
    across Cambridge and Somerville. Feel free to follow the narrative and
    then play around with the tools. Hover over regions to see average home values by
    zip code and their associated green line stop.
  </p>
</div>
{:else if position === 'between'}
<section class="bridge content-narrow">
  <div class="bridge-eyebrow">PART TWO · NEW HOUSING</div>
  <h2 class="bridge-title">If prices didn't surge, what about supply?</h2>
  <p>
    Price is only half the displacement story. The other half is whether new housing actually got built —
    and whether enough of it was deed-restricted affordable to absorb pressure on existing residents.
    Below: every development project added between 2011 and 2025, drawn from MassBuilds and filtered to the
    nine ZIPs in the corridor. Each bubble is one project. The outer ring is total units. The dark teal
    inner circle is the deed-restricted affordable share.
  </p>
</section>
{:else if position === 'after'}
<!-- ============================================================
     NARRATIVE — AFTER THE VISUALIZATION
     Closing summary, key takeaway, and policy lens.
     ============================================================ -->

<div class="narrative after">
  <div class="kicker">The takeaway</div>
  <h2>Average home value increases in Somerville were likely coming regardless of The Green Line</h2>

  <p class="lede">
    The average home value increases seen in Somerville and Medford were an inevitable catch up to western parts
    of Cambridge. These were <b>not necessarily caused by the building of the Green Line Extension.</b> We
    saw the largest average home value increases over this time period around Harvard Square and Red Line stops.
  </p>

  <div class="stat-grid" aria-label="Summary statistics">
    <div class="stat-card">
      <div class="stat-num">+94%</div>
      <div class="stat-lbl">Somerville average home values nearly doubled<br/>2012–2019, before Green Line opened. This is in 
      line with growth around the Red Line as well.</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">+3.8%</div>
      <div class="stat-lbl">Somerville average home value growth<br/>was much lower after Green Line opening, 2022-2025</div>
    </div>
    <div class="stat-card">
      <div class="stat-num stat-comparison"><span class="green-line-stat">9.2%</span> vs <span class="red-line-stat">8.9%</span></div>
      <div class="stat-lbl">Green vs Red Line corridor<br/>annual average home value growth, 2012–2019. These are virtually the same.</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">$43K narrower</div>
      <div class="stat-lbl">The gap between Harvard Square and Davis Square got closer between 2010 and 2025, but 
        there are many possible factors at play.
      </div>
    </div>
  </div>

  <h3>What we actually saw</h3>
  <ul class="findings">
    <li>
      <strong>Average home value increases near green line stops stayed parallel to red line neighborhoods</strong>
      Average home values along the green line rose, but not different from neighboring zipcodes. Harvard Square,
      North Cambridge, and Kendall all remain most expensive.

    </li>
    <li>
      <strong>Home value changes came before the green line.</strong>
      The biggest home value spikes in Somerville came in the mid 2010s, far before completion of the green line.
      Broader market trends than local transit access seem to have a stronger impact on home values
    </li>
    <li>
      <strong>Strong zoning policies probably aided in keeping home values from soaring.</strong>
      Inclusionary Zoning Ordinance required housing developemnts to keep 20% of their floor space
      for affordable housing. Although this wouldn't affect home sales prices, it reduces the building
      of strictly luxury developments. These luxury developments can spike local home values.
    </li>
  </ul>

  <h3>Policy Concerns and Generalizations</h3>
  <ul class="findings">
    <li>
      <strong>Info supporting inclusionary zoning policies</strong>
      Zoning policies allowed for affordability to be maintained with new developments. It also is very controversial. Check 
      out the following resources to learn more:
      <a href="https://dash.harvard.edu/entities/publication/ffbbc9de-d3d7-4de1-add2-47303bfad3e9" target="_blank" rel="noopener noreferrer">Harvard DASH publication</a>
      and
      <a href="https://www.cambridgema.gov/CDD/housing/inclusionaryhousing" target="_blank" rel="noopener noreferrer">Cambridge inclusionary housing page</a>.
    </li>
    <li>
      <strong>Sources criticizing inclusionary zoning requirements</strong>
      The following sources are more critical of inclusionary zoning and allow for residents to get a 
      better picture of the policy. Be skeptical of the sources and who might benefit from reducing these policies.
      <a href="https://betterblocksnj.org/2026/03/03/does-unfunded-inclusionary-zoning-produce-affordable-housing-at-scale-part-iv-in-our-housing-policy-series/">New Haven Zoning Study</a>
    </li>
    <li>
      <strong>Takeaways from the Green Line are not necessarily generalizable to other areas</strong>
      Just because transit access didn't spike average home values in Cambridge, Somerville, and Medford; this does
      not necessarily mean other projects won't have different impacts. City culture, government policies,
      and market trends all can have serious impacts on whether a project increases home values.
    </li>
  </ul>

  <p class="closer">
    The headline you'll often hear is "new transit gentrifies the neighborhood."
    This is not what this data shows. New transit, paired with
    inclusionary zoning and an active permitting pipeline, expanded the housing
    stock and grew the share of homes set aside as affordable.
  </p>
</div>

{/if}

<style>
  .bridge, .afterword {
    padding-block: 5rem 4rem;
  }

  .bridge-eyebrow, .afterword-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: #00843D;
    margin-bottom: 1rem;
  }
  .afterword-eyebrow { color: #0f766e; }

  .bridge-title, .afterword-title {
    font-size: clamp(1.7rem, 3.2vw, 2.4rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0 0 1.2rem;
    color: light-dark(#0f172a, #f1f5f9);
    text-wrap: balance;
  }

  p {
    font-size: 1.02rem;
    line-height: 1.75;
    color: light-dark(#334155, #cbd5e1);
    margin: 0 0 1.1rem;
  }

  .caveat {
    margin-top: 1.5rem;
    padding-top: 1.2rem;
    border-top: 1px solid light-dark(#e2e8f0, #2d3748);
    font-size: 0.92rem;
    color: light-dark(#64748b, #94a3b8);
  }

  .after {
    margin: 4rem auto 3rem;
    padding: 2.5rem 2rem;
    border-top: 1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.1));
  }

  h2 {
    font-size: 1.6rem;
    margin: 0.2rem 0 1rem;
    line-height: 1.25;
  }

  .after h2 {
    font-size: clamp(1.7rem, 2.6vw, 2.15rem);
    line-height: 1.18;
    letter-spacing: -0.015em;
    max-width: 52ch;
    text-wrap: balance;
    margin: 0.4rem 0 1.25rem;
  }

  h3 {
    font-size: 1.05rem;
    margin: 2rem 0 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #00843D;
  }

  .kicker {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #00843D;
    margin-bottom: 0.4rem;
  }

  .lede {
    font-size: 1.05rem;
    line-height: 1.7;
    color: light-dark(#1f2937, #e2e8f0);
    margin: 0 0 1.5rem;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.85rem;
    margin: 1.5rem 0 2rem;
  }

  .stat-card {
    padding: 1rem 1.1rem;
    border-radius: 10px;
    background: light-dark(#f8fafc, rgba(255,255,255,0.04));
    border: 1px solid light-dark(rgba(0,0,0,0.06), rgba(255,255,255,0.08));
  }

  .stat-num {
    font-size: 1.55rem;
    font-weight: 700;
    color: #00843D;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    margin-bottom: 0.35rem;
  }

  .stat-comparison {
    color: inherit;
  }

  .green-line-stat {
    color: #00843D;
  }

  .red-line-stat {
    color: #DA291C;
  }

  .stat-lbl {
    font-size: 0.78rem;
    line-height: 1.35;
    color: light-dark(#475569, #94a3b8);
    letter-spacing: 0.02em;
  }

  .findings {
    margin: 0.5rem 0 0;
    padding-left: 1.25rem;
  }

  .findings li {
    margin-bottom: 0.85rem;
    line-height: 1.65;
  }

  .findings strong {
    color: light-dark(#0f172a, #f1f5f9);
  }

  .closer {
    margin-top: 1.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.08));
    font-size: 1rem;
    color: light-dark(#334155, #cbd5e1);
  }
</style>
