<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import BarHorizontal from '$lib/BarHorizontal.svelte';
  import { computePosition, autoPlacement, offset } from '@floating-ui/dom';

  let locData = [];
  let barData = [];
  let commits = [];

  let width = 1000, height = 600;
  let margin = { top: 20, right: 20, bottom: 30, left: 50 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  let xAxis, yAxis, yAxisGridlines;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function timeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  }

  $: longestFile = d3.greatest(
    d3.rollups(locData, v => v.length, d => d.file),
    ([, n]) => n
  )?.[0] ?? '';

  $: busiestTimeOfDay = d3.greatest(
    d3.rollups(commits, v => v.length, d => timeOfDay(d.datetime.getHours())),
    ([, n]) => n
  )?.[0] ?? '';

  $: busiestDay = (() => {
    const max = d3.greatest(
      d3.rollups(commits, v => v.length, d => d.datetime.getDay()),
      ([, n]) => n
    );
    return max ? days[max[0]] : '';
  })();

  $: [minDate, maxDate] = d3.extent(commits.map(d => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  $: xScale = d3.scaleTime()
    .domain([minDate, maxDatePlusOne])
    .range([usableArea.left, usableArea.right])
    .nice();

  $: yScale = d3.scaleLinear()
    .domain([24, 0])
    .range([usableArea.bottom, usableArea.top]);

  $: rScale = d3.scaleSqrt()
    .domain(d3.extent(commits, d => d.totalLines))
    .range([5, 30]);

  let clickedCommits = [];

  $: selectedLines = (clickedCommits.length > 0 ? clickedCommits.flatMap(d => d.lines) : locData);
  $: selectedCounts = d3.rollup(selectedLines, v => v.length, d => d.type);
  $: allTypes = Array.from(new Set(locData.map(d => d.type)));
  $: barData = allTypes.map(type => ({ label: String(type), value: selectedCounts.get(type) ?? 0 }));

  let hoveredIndex = -1;
  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
  let commitTooltip;
  let tooltipPosition = {x: 0, y: 0};

  async function dotInteraction(index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed",
        middleware: [
          offset(5),
          autoPlacement()
        ],
      });
    } else if (evt.type === "mouseleave") {
      hoveredIndex = -1;
    } else if (evt.type === "click") {
      let commit = commits[index];
      if (!clickedCommits.includes(commit)) {
        clickedCommits = [...clickedCommits, commit];
      } else {
        clickedCommits = clickedCommits.filter(c => c !== commit);
      }
      console.log(clickedCommits);
    }
  }

  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d, %Y")));
    d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale)
        .tickFormat("")
        .tickSize(-usableArea.width)
    );
  }

  onMount(async () => {
    locData = await d3.csv(`${base}/loc.csv`, row => ({
      ...row,
      line: Number(row.line),
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime)
    }));
    barData = d3.rollups(locData, v => v.length, d => d.type)
      .map(([lang, count]) => ({ label: lang, value: count }));
    commits = d3.sort(d3.groups(locData, d => d.commit).map(([commit, lines]) => {
      let first = lines[0];
      let {author, date, time, timezone, datetime} = first;
      let ret = {
        id: commit,
        url: "https://github.com/hiromitsdm/psychic-octo-invention/commit/" + commit,
        author, date, time, timezone, datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
        lines: lines
      };
      return ret;
    }), d => -d.totalLines);
  });
</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1>Meta</h1>

<dl class="stats">
  <div>
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{locData.length}</dd>
  </div>
  <div>
    <dt>Total Commits</dt>
    <dd>{commits.length}</dd>
  </div>
  <div>
    <dt>Longest File</dt>
    <dd>{longestFile.split('/').slice(-2).join('/')}</dd>
  </div>
  <div>
    <dt>Busiest Time of Day</dt>
    <dd>{busiestTimeOfDay}</dd>
  </div>
  <div>
    <dt>Busiest Day of Week</dt>
    <dd>{busiestDay}</dd>
  </div>
</dl>

<h3>Commits by time of day</h3>
<svg viewBox="0 0 {width} {height}">
  <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  <g class="dots">
    {#each commits as commit, index}
      <circle
        class:selected={clickedCommits.includes(commit)}
        on:mouseenter={evt => dotInteraction(index, evt)}
        on:mouseleave={evt => dotInteraction(index, evt)}
        on:click={evt => dotInteraction(index, evt)}
        cx={xScale(commit.datetime)}
        cy={yScale(commit.hourFrac)}
        r={rScale(commit.totalLines)}
        fill="steelblue"
        fill-opacity="0.5"
      />
    {/each}
  </g>
</svg>

<dl class="info tooltip" hidden={hoveredIndex === -1} style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px" bind:this={commitTooltip}>
  <dt>Commit</dt>
  <dd><a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a></dd>
  <dt>Date</dt>
  <dd>{hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"})}</dd>
  <dt>Time</dt>
  <dd>{hoveredCommit.datetime?.toLocaleString("en", {timeStyle: "short"})}</dd>
  <dt>Author</dt>
  <dd>{hoveredCommit.author}</dd>
  <dt>Lines edited</dt>
  <dd>{hoveredCommit.totalLines}</dd>
</dl>

<BarHorizontal data={barData} title={clickedCommits.length > 0 ? "Selected Commits Breakdown" : "Website Breakdown"} />

<style>
  svg {
    overflow: visible;
  }

  .gridlines {
    stroke-opacity: .2;
  }

  dl.info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25em 1em;
    margin: 0;
    transition-duration: 500ms;
    transition-property: opacity, visibility;
  }

  dl.info[hidden]:not(:hover, :focus-within) {
    opacity: 0;
    visibility: hidden;
  }

  dl.info dt {
    opacity: 0.6;
    font-size: 0.8em;
    text-transform: uppercase;
  }

  dl.info dd {
    margin: 0;
    font-weight: bold;
  }

  .tooltip {
    position: fixed;
    background: oklch(100% 0% 0 / 80%);
    border-radius: 0.5em;
    padding: 0.75em 1em;
    box-shadow: 0 4px 20px oklch(0% 0 0 / 15%);
    backdrop-filter: blur(8px);
    color: black;
  }

  circle {
    transition: 200ms;
    &:hover {
      fill: darkgreen;
    }
  }

  .selected {
    fill: var(--color-accent);
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em 2.5em;
    margin-block: 1.5em;
  }

  .stats > div {
    display: flex;
    flex-direction: column;
  }

  .stats dt {
    font-size: 0.75em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.6;
  }

  .stats dd {
    margin: 0;
    font-size: 2em;
    font-weight: bold;
  }
</style>

&& --- IGNORE ---