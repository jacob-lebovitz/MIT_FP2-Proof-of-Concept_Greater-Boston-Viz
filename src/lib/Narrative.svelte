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
    The following tools allow us to visualization price changes over time
    across Cambridge and Somerville. Feel free to follow the narrative and
    then play around with the tools. Hover over regions to see specific prices by
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
  <h2>New transit didn't price out these neighborhoods — it built more of them.</h2>

  <p class="lede">
    Across two decades and three cities, Cambridge, Somerville, and Medford added
    housing throughout the Green Line Extension's slow march from lawsuit to ribbon-cutting.
    Prices climbed everywhere in Greater Boston since 2012 (the start of construction), but the largest jumps tracked the
    <strong>Red Line</strong> (Harvard Square, Kendall), not the new GLX corridor.
  </p>

  <div class="stat-grid" aria-label="Summary statistics">
    <div class="stat-card">
      <div class="stat-num">390</div>
      <div class="stat-lbl">Projects mapped<br/>(2011–2025)</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">~28,600</div>
      <div class="stat-lbl">New housing units<br/>cumulatively added</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">~3,900</div>
      <div class="stat-lbl">Of those are<br/>income-restricted</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">6% → 14%</div>
      <div class="stat-lbl">Affordable share of<br/>cumulative stock</div>
    </div>
  </div>

  <h3>What we actually saw</h3>
  <ul class="findings">
    <li>
      <strong>The "transit premium" myth got smaller, not bigger.</strong>
      Housing prices along the green line rose, but not unlikely neighboring zipcodes. Transit development did not result in drastically higher prices. 
    </li>
    <li>
      <strong>Supply responded to anticipation, not the ribbon-cutting.</strong>
      Somerville's biggest development years (2014, 2016, 2019) all happened
      <em>during</em> construction. Once trains were running, the pipeline thinned, as
      2022–2024 combined added fewer units than 2019 alone.
    </li>
    <li>
      <strong>Affordability rose with the rules, not the trains.</strong>
      Affordable units more than tripled between 2015 and 2020, due to new inclusionary zoning policies. The trend continued past
      2022, and it allowed for maining a mixed-income demographic.
    </li>
    <li>
      <strong>Cambridge built fewer, larger projects; Somerville built many smaller ones.</strong>
      Both zip codes investing in housing developments near Green Line stations, though they were of different size and function.
    </li>
  </ul>

  <h3>If you live here, watch these signals</h3>
  <ul class="findings">
    <li>
      <strong>Inclusionary zoning percentages on new approvals.</strong>
      Zoning policies allowed for affordability to be maintained with new developments.
    </li>
    <li>
      <strong>Pre-emptive permitting around future transit.</strong>
      Most of the expansion units arrived before service. Cities that
      upzone <em>during</em> infrastructure construction capture more supply
      than those that wait until trains run.
    </li>
    <li>
      <strong>Stable pricing along Green Line route.</strong>
      The strongest price pressure in this map sits around Harvard, Porter, and
      Kendall. Affordability policy in the GLX area needs to be planned with
      Red Line displacement risk in mind, not just GLX-corridor risk.
    </li>
  </ul>

  <p class="closer">
    The headline you'll often hear is "new transit gentrifies the neighborhood."
    This is not what this data shows. New transit, paired with
    inclusionary zoning and an active permitting pipeline, expanded the housing
    stock and grew the share of homes set aside as affordable. That's a more
    boring story, but a more useful one for the next corridor.
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
    font-size: 1.85rem;
    max-width: 28ch;
  }

  h3 {
    font-size: 1.05rem;
    margin: 2rem 0 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: light-dark(#475569, #94a3b8);
  }

  .kicker {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #2563eb;
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
    color: #2563eb;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    margin-bottom: 0.35rem;
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
