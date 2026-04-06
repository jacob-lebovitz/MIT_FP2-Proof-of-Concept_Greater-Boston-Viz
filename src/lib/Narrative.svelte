<script>
  export let position; // 'before' or 'after'
</script>

{#if position === 'before'}
<!-- ============================================================
     NARRATIVE — BEFORE THE VISUALIZATION
     Write your intro text below. Plain HTML is fine.
     Example: <p>Your text here.</p>
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

{:else if position === 'after'}
<!-- ============================================================
     NARRATIVE — AFTER THE VISUALIZATION
     Write your takeaway / analysis text below.
     ============================================================ -->

<div class="narrative after">
  <p>
    The data shows there is a clear increase in price over time, but we don't see a significant correlation 
    with the news around the green line or additional stops. </p>
    <ol>
    <li>2005:
    Initial price increases shown in the Harvard Square and Cambridgeport areas. These area are accesible off the 
    red line which has been in place for decades. The green line extension is not yet a major topic of discussion,
     and there are no significant price increases around the projected stops.
    </li>
    <li>
    2012:
    Construction has broken ground on the green line extension. We see no significant price increases in 
    the areas around the green line or their projected new stops. We actually see no real significant price increases 
    over 2005 in any neighborhoods. This is unusual stagnation in a housing market and could be related to the 
    2008 financial crisis.
    </li>

    <li>
    2017:
    The green line extension is still under construction, but we see significant price increases across the board.
    The price increases are especially significant in the Harvard Square and Cambridgeport areas, which are accessible off the red line.
    The areas around projected green line stops see relatively less price increases.
    </li>
    <li>
    2021:
    Construction is still underway on green line. Price increases are really only seen in the Harvard Square and 
    West Cambridge areas.
    </li>
    <li>
    2022:
    Green line extension is now active in all neighborhoods. Price increases happen only in these areas, which are still 
    relatively chepaer than west Cambridge.
    </li>
     <li>
    2025:
    With an active green line, prices in Somervilles and among the green line stay slightly below the 
    prices in Harvard Square and West Cambridge. Interestingly, Kendall Square, more accessible off the red line 
    has seen significant price increases.
     </li>
    </ol>

</div>

{/if}

<style>
  .narrative {
    max-width: 720px;
    line-height: 1.7;
    font-size: 1rem;
  }

  .before {
    margin-bottom: 2rem;
  }

  .after {
    margin-top: 2rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
</style>
