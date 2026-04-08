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
