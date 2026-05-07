<script>
  import ScrollyMap from "$lib/ScrollyMap.svelte";
  import ScrollyDevelopments from "$lib/ScrollyDevelopments.svelte";
  import Narrative from "$lib/Narrative.svelte";
  import TitlePage from "$lib/TitlePage.svelte";
  import ZipcodeMap from "$lib/ZipcodeMap.svelte";
  import { currentYear } from "$lib/stores.js";
  // import WriteupDesign from "$lib/WriteupDesign.svelte";
  // import WriteupPlan from "$lib/WriteupPlan.svelte";
</script>

<TitlePage />
<ScrollyMap />

<section class="explore content-narrow">
  <div class="explore-eyebrow">EXPLORE THE LINE CHART</div>
  <h2 class="explore-title">Every ZIP, every year — drag the dashed line to scrub</h2>
  <p class="explore-sub">
    Hover any line for the price at that year. Hover the green &amp; red info dots above the chart for
    Green Line milestones and macro context.
  </p>
  <div class="explore-chart">
    <ZipcodeMap year={$currentYear} hideSlider={true} hideLineChart={false} compact={false} />
  </div>
</section>

<Narrative position="between" />
<ScrollyDevelopments />
<Narrative position="after" />

<style>
  .explore { padding-block: 4rem 3rem; }
  .explore-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: #00843D;
    margin-bottom: 0.9rem;
  }
  .explore-title {
    font-size: clamp(1.5rem, 2.6vw, 2rem);
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.02em;
    margin: 0 0 0.6rem;
  }
  .explore-sub {
    font-size: 0.95rem;
    line-height: 1.6;
    color: light-dark(#475569, #94a3b8);
    margin: 0 0 1.5rem;
  }
  /* Allow the chart and map to break out of content-narrow */
  .explore-chart {
    width: min(1300px, 100vw - 2rem);
    margin-left: 50%;
    transform: translateX(-50%);
  }
</style>
<!-- <WriteupDesign /> -->
<!-- <WriteupPlan /> -->
