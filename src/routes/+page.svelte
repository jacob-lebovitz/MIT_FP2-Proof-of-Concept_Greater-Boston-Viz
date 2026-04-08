<script>
  import ScrollyMap from "$lib/ScrollyMap.svelte";
  import LineChart from "$lib/LineChart.svelte";
  import Narrative from "$lib/Narrative.svelte";
  import WriteupDesign from "$lib/WriteupDesign.svelte";
  import WriteupPlan from "$lib/WriteupPlan.svelte";
</script>

<Narrative position="before" />
<ScrollyMap />
<LineChart />
<Narrative position="after" />
<WriteupDesign />
<WriteupPlan />
