<script>
  import projects from '$lib/projects.json';
  import Project from "$lib/Project.svelte";
  import ProjectNarrative from "$lib/ProjectNarrative.svelte";
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { base } from '$app/paths';
  import Bar from '$lib/Bar.svelte';

  let years = projects.map(proj => proj.year);
  let range = Math.max(...years) - Math.min(...years);

  $: barData = d3.rollups(projects, v => v.length, d => d.yearEnd)
    .map(([year, count]) => ({ label: String(year), value: count }));

  let rawData = [];
  let wrangled = [];
  let percentages = [];

  onMount(async () => {
    rawData = await d3.json(`${base}/lab6_example.json`);
    wrangled = d3.rollups(
      rawData,
      v => d3.sum(v, d => d.lines),
      d => d.language
    );
    const totalLines = d3.sum(rawData, d => d.lines);
    percentages = d3.rollups(
      rawData,
      v => d3.sum(v, d => d.lines) / totalLines * 100,
      d => d.language
    );
    console.log(rawData);
  });
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects over {range} Years</h1>

<p>Scroll down to see my a timeline of my projects and how they've contributed to my professional and personal life</p>

<Bar data={barData} />

<section>
  <h2>Data wrangling result</h2>
  <pre>{JSON.stringify(wrangled, null, 2)}</pre>
  <h2>Percentages</h2>
  <pre>{JSON.stringify(percentages.map(([lang, pct]) => [lang, pct.toFixed(2) + '%']), null, 2)}</pre>
</section>

<ProjectNarrative />

<p class="outro">Thanks for scrolling through my project story! Feel free to explore all of the projects at your leisure below.</p>

<div class="projects">
  {#each projects as p}
    <Project data={p} />
  {/each}
</div>

<style>
  .outro {
    margin-bottom: 3rem;
  }
</style>
        <!-- <article>
            <h2>A3 Visualization Critique & Redesign</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p><a href="A3/A3_report.html">View A3 Report</a></p>
        </article>
        <article>
            <h2>Tempore hic quam dolorum?</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Ipsa provident reprehenderit saepe placeat et quia nam architecto in. Cumque, nostrum! Magni amet porro molestiae exercitationem veritatis eius ipsa quam. Qui reprehenderit quidem quos consectetur ullam velit accusantium officiis.</p>
        </article>
        <article>
            <h2>Autem libero officia corrupti.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Corporis architecto, officiis delectus neque non eveniet hic necessitatibus aliquam adipisci expedita molestiae magnam sit facere asperiores quasi cupiditate obcaecati eius autem perferendis commodi? Nihil quae sunt corporis quidem voluptas.</p>
        </article>
        <article>
            <h2>Totam illum architecto veniam.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Itaque eius assumenda, alias distinctio dicta corrupti numquam dolorem maxime, voluptate reprehenderit cum aliquam iusto praesentium ratione voluptates nisi nostrum. Magnam quaerat blanditiis voluptatibus neque, quod dolorum sunt nam alias!</p>
        </article>
        <article>
            <h2>Ullam quia deleniti facilis.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Eveniet veritatis fugiat quia eos natus ea blanditiis earum. Fugiat corporis porro maxime ex at non neque ut quia, cumque, quae soluta, minima deleniti facilis quisquam voluptates! Qui, in quasi?</p>
        </article>
        <article>
            <h2>Provident inventore quod nemo?</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Consequatur officiis, consectetur quisquam voluptatum officia esse voluptatibus assumenda ducimus impedit eveniet laboriosam sint itaque rerum unde! Nam ad ea eligendi impedit sequi, odit saepe voluptatem nisi minima nobis atque.</p>
        </article>
        <article>
            <h2>Ea est ab voluptatem.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Accusantium nisi aliquam rerum, magni facilis, ipsa facere error ipsam, vitae aut ut et velit totam ducimus commodi praesentium! Totam quod repellat numquam libero nulla explicabo. Iure quae mollitia ad?</p>
        </article>
        <article>
            <h2>Animi labore soluta rem!</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Repudiandae laboriosam mollitia id accusantium nobis error assumenda debitis deserunt, ab saepe perspiciatis, maiores consequatur dolorum dignissimos, unde recusandae autem enim voluptates? Nesciunt voluptas, temporibus maiores amet sequi natus quia.</p>
        </article>
        <article>
            <h2>Deleniti explicabo cumque laudantium!</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Repellendus quod assumenda pariatur dolorem, quo voluptatum labore sunt ab impedit doloremque aspernatur corrupti error esse nesciunt ducimus perferendis aut ex adipisci totam mollitia? Vitae beatae sapiente amet dolor nisi.</p>
        </article>
        <article>
            <h2>Atque ipsam tenetur in.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Libero vero dolorum itaque facere cum voluptas iure molestias nam ipsam, quod aliquam nesciunt corrupti fugit quo, quibusdam sequi alias earum quis rerum dolor, consequatur laboriosam illo assumenda? Iusto, ipsa?</p>
        </article>
        <article>
            <h2>Eveniet vel reiciendis quas.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Voluptate, adipisci, rerum repellat molestias porro expedita dolore, placeat enim repudiandae maxime at consequatur. Nihil maxime, vitae esse, quisquam temporibus expedita nisi voluptatum laborum assumenda ut et, animi ea deleniti.</p>
        </article>
        <article>
            <h2>Nemo voluptates voluptas placeat.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Quia repellat aliquid quisquam minima, autem atque rerum in adipisci eius possimus sequi culpa suscipit aliquam tempore eum similique inventore. Itaque aliquid corporis maiores voluptate, sed fugiat nemo commodi. Ea?</p>
        </article> -->