<script>
  import ZipcodeMap from "$lib/ZipcodeMap.svelte";
  import Narrative from "$lib/Narrative.svelte";
  import WriteupDesign from "$lib/WriteupDesign.svelte";
  import WriteupPlan from "$lib/WriteupPlan.svelte";
</script>

<Narrative position="before" />
<ZipcodeMap />
<Narrative position="after" />
<WriteupDesign />
<WriteupPlan />
