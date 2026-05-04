<script>
  export let position; // 'before' | 'between' | 'after'
</script>

{#if position === 'between'}
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
<section class="afterword content-narrow">
  <div class="afterword-eyebrow">THE TAKEAWAY</div>
  <h2 class="afterword-title">A counter-example to the displacement default</h2>
  <p>
    The Green Line Extension is one specific corridor and one specific transit project. We're not making
    the broader claim that all transit-oriented development avoids displacement — the Red Line itself is
    visible evidence that new transit can drive significant price growth, and Kendall Square's gains over
    the past decade are some of the largest in the dataset. But for the GLX corridor specifically, two
    decades of fear and litigation predicted a pattern the data simply does not show.
  </p>
  <p>
    Prices in Somerville and Medford rose, but they rose less than their Red Line neighbors. New housing
    was built — most of it concentrated along the corridor itself. The deed-restricted affordable share
    more than doubled, from 6% in 2011 to 14% by 2025. Whatever the GLX did to the neighborhoods it now
    serves, it didn't deliver the displacement crisis its opponents warned about.
  </p>
  <p class="caveat">
    A note on units of analysis: this visualization uses ZIP codes because that's the unit our price data
    is published in. ZIP codes are not a meaningful unit for housing or transit policy — they're postal
    routes. A version of this analysis at the census-tract level would be more rigorous and is a natural
    next step.
  </p>
</section>
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
</style>
