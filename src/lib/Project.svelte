<script>
  import { base } from '$app/paths';
  export let data = {};
</script>

<article>
    <h2>{data.title}</h2>
    <img src="{base}/{data.image}" alt="">
    <p><strong>{data.yearEnd ? `${data.year}–${data.yearEnd}` : data.year}</strong> | {data.description}</p>
</article>

<style>
  article {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
  }

  h2 {
    margin: 0;
  }
</style>