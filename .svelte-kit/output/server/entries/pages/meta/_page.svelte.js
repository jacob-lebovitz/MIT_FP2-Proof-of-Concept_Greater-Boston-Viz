import { c as create_ssr_component, f as escape, d as add_attribute, e as each, v as validate_component } from "../../../chunks/ssr.js";
import * as d3 from "d3";
const BarHorizontal_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "svg.svelte-is3r0u{max-width:100%;height:auto;overflow:visible}.container.svelte-is3r0u{display:flex;align-items:center;gap:1rem}.legend.svelte-is3r0u{flex:1;list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.4rem}li.svelte-is3r0u{display:flex;align-items:center;gap:0.5rem}.swatch.svelte-is3r0u{width:12px;height:12px;background-color:var(--color);flex-shrink:0}.chart-title.svelte-is3r0u{font-size:0.8em;font-weight:bold;fill:currentColor}.axis-label.svelte-is3r0u{font-size:0.65em;fill:currentColor}.annotation.svelte-is3r0u{font-size:0.6em;fill:currentColor;font-style:italic}",
  map: null
};
let width$1 = 500;
let height$1 = 160;
const BarHorizontal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let xScale;
  let yScale;
  let colorScale;
  let maxBar;
  let { data = [] } = $$props;
  let { title = "" } = $$props;
  let margin = {
    top: 25,
    right: 140,
    bottom: 35,
    left: 70
  };
  let innerWidth = width$1 - margin.left - margin.right;
  let innerHeight = height$1 - margin.top - margin.bottom;
  let xAxis, yAxis;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$1);
  xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) || 1]).range([0, innerWidth]);
  yScale = d3.scaleBand().domain(data.map((d) => d.label)).range([0, innerHeight]).padding(0.65);
  colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(data.map((d) => d.label));
  maxBar = d3.greatest(data, (d) => d.value);
  return `<div class="container svelte-is3r0u"><svg viewBox="${"0 0 " + escape(width$1, true) + " " + escape(height$1, true)}" class="svelte-is3r0u"><text${add_attribute("x", margin.left + innerWidth / 2, 0)}${add_attribute("y", margin.top / 2, 0)} text-anchor="middle" class="chart-title svelte-is3r0u">${escape(title)}</text><g transform="${"translate(" + escape(margin.left, true) + ", " + escape(margin.top + innerHeight, true) + ")"}"${add_attribute("this", xAxis, 0)}></g><g transform="${"translate(" + escape(margin.left, true) + ", " + escape(margin.top, true) + ")"}"${add_attribute("this", yAxis, 0)}></g><g transform="${"translate(" + escape(margin.left, true) + ", " + escape(margin.top, true) + ")"}">${each(data, (d) => {
    return `<rect${add_attribute("x", 0, 0)}${add_attribute("y", yScale(d.label), 0)}${add_attribute("width", xScale(d.value), 0)}${add_attribute("height", yScale.bandwidth(), 0)}${add_attribute("fill", colorScale(d.label), 0)}></rect>`;
  })}${maxBar ? `<rect${add_attribute("x", 0, 0)}${add_attribute("y", yScale(maxBar.label), 0)}${add_attribute("width", xScale(maxBar.value), 0)}${add_attribute("height", yScale.bandwidth(), 0)} fill="none" stroke="currentColor" stroke-width="2"></rect> <text${add_attribute("x", xScale(maxBar.value) + 8, 0)}${add_attribute("y", yScale(maxBar.label) + yScale.bandwidth() / 2, 0)} text-anchor="start" dominant-baseline="middle" class="annotation svelte-is3r0u">Most lines of code</text>` : ``}<text${add_attribute("x", innerWidth / 2, 0)}${add_attribute("y", innerHeight + margin.bottom - 8, 0)} text-anchor="middle" class="axis-label svelte-is3r0u">Lines of Code
      </text><text${add_attribute("x", -(innerHeight / 2), 0)}${add_attribute("y", -margin.left + 12, 0)} text-anchor="middle" transform="rotate(-90)" class="axis-label svelte-is3r0u"><tspan>Programming</tspan> <tspan dy="1.2em"${add_attribute("x", -(innerHeight / 2), 0)}>Language</tspan></text></g></svg> <ul class="legend svelte-is3r0u">${each(data, (d) => {
    return `<li style="${"--color: " + escape(colorScale(d.label), true)}" class="svelte-is3r0u"><span class="swatch svelte-is3r0u"></span> ${escape(d.label)} <em>(${escape(d.value)})</em> </li>`;
  })}</ul> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "svg.svelte-vn5y90.svelte-vn5y90{overflow:visible}.gridlines.svelte-vn5y90.svelte-vn5y90{stroke-opacity:.2}dl.info.svelte-vn5y90.svelte-vn5y90{display:grid;grid-template-columns:auto 1fr;gap:0.25em 1em;margin:0;transition-duration:500ms;transition-property:opacity, visibility}dl.info[hidden].svelte-vn5y90.svelte-vn5y90:not(:hover, :focus-within){opacity:0;visibility:hidden}dl.info.svelte-vn5y90 dt.svelte-vn5y90{opacity:0.6;font-size:0.8em;text-transform:uppercase}dl.info.svelte-vn5y90 dd.svelte-vn5y90{margin:0;font-weight:bold}.tooltip.svelte-vn5y90.svelte-vn5y90{position:fixed;background:oklch(100% 0% 0 / 80%);border-radius:0.5em;padding:0.75em 1em;box-shadow:0 4px 20px oklch(0% 0 0 / 15%);backdrop-filter:blur(8px);color:black}circle.svelte-vn5y90.svelte-vn5y90{transition:200ms;&:hover {\n      fill: darkgreen;\n    }}.selected.svelte-vn5y90.svelte-vn5y90{fill:var(--color-accent)}.stats.svelte-vn5y90.svelte-vn5y90{display:flex;flex-wrap:wrap;gap:1.5em 2.5em;margin-block:1.5em}.stats.svelte-vn5y90>div.svelte-vn5y90{display:flex;flex-direction:column}.stats.svelte-vn5y90 dt.svelte-vn5y90{font-size:0.75em;text-transform:uppercase;letter-spacing:0.05em;opacity:0.6}.stats.svelte-vn5y90 dd.svelte-vn5y90{margin:0;font-size:2em;font-weight:bold}",
  map: null
};
let width = 1e3, height = 600;
function timeOfDay(hour) {
  if (hour >= 5 && hour < 12)
    return "Morning";
  if (hour >= 12 && hour < 17)
    return "Afternoon";
  if (hour >= 17 && hour < 21)
    return "Evening";
  return "Night";
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let longestFile;
  let busiestTimeOfDay;
  let busiestDay;
  let minDate;
  let maxDate;
  let maxDatePlusOne;
  let xScale;
  let yScale;
  let rScale;
  let selectedLines;
  let selectedCounts;
  let allTypes;
  let hoveredCommit;
  let locData = [];
  let barData = [];
  let commits = [];
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
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let clickedCommits = [];
  let hoveredIndex = -1;
  let commitTooltip;
  let tooltipPosition = { x: 0, y: 0 };
  $$result.css.add(css);
  longestFile = d3.greatest(d3.rollups(locData, (v) => v.length, (d) => d.file), ([, n]) => n)?.[0] ?? "";
  busiestTimeOfDay = d3.greatest(d3.rollups(commits, (v) => v.length, (d) => timeOfDay(d.datetime.getHours())), ([, n]) => n)?.[0] ?? "";
  busiestDay = (() => {
    const max = d3.greatest(d3.rollups(commits, (v) => v.length, (d) => d.datetime.getDay()), ([, n]) => n);
    return max ? days[max[0]] : "";
  })();
  [minDate, maxDate] = d3.extent(commits.map((d) => d.date));
  maxDatePlusOne = new Date(maxDate);
  {
    maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
  }
  xScale = d3.scaleTime().domain([minDate, maxDatePlusOne]).range([usableArea.left, usableArea.right]).nice();
  yScale = d3.scaleLinear().domain([24, 0]).range([usableArea.bottom, usableArea.top]);
  rScale = d3.scaleSqrt().domain(d3.extent(commits, (d) => d.totalLines)).range([5, 30]);
  selectedLines = clickedCommits.length > 0 ? clickedCommits.flatMap((d) => d.lines) : locData;
  selectedCounts = d3.rollup(selectedLines, (v) => v.length, (d) => d.type);
  allTypes = Array.from(new Set(locData.map((d) => d.type)));
  barData = allTypes.map((type) => ({
    label: String(type),
    value: selectedCounts.get(type) ?? 0
  }));
  hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
  {
    {
      d3.select(xAxis).call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d, %Y")));
      d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, "0") + ":00"));
      d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width));
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-wrz3ma_START -->${$$result.title = `<title>Meta</title>`, ""}<!-- HEAD_svelte-wrz3ma_END -->`, ""} <h1 data-svelte-h="svelte-nwbz8d">Meta</h1> <dl class="stats svelte-vn5y90"><div class="svelte-vn5y90"><dt class="svelte-vn5y90" data-svelte-h="svelte-kbs0rl">Total <abbr title="Lines of code">LOC</abbr></dt> <dd class="svelte-vn5y90">${escape(locData.length)}</dd> </div><div class="svelte-vn5y90"><dt class="svelte-vn5y90" data-svelte-h="svelte-dsy4r2">Total Commits</dt> <dd class="svelte-vn5y90">${escape(commits.length)}</dd> </div><div class="svelte-vn5y90"><dt class="svelte-vn5y90" data-svelte-h="svelte-1kqop12">Longest File</dt> <dd class="svelte-vn5y90">${escape(longestFile.split("/").slice(-2).join("/"))}</dd> </div><div class="svelte-vn5y90"><dt class="svelte-vn5y90" data-svelte-h="svelte-acqvmz">Busiest Time of Day</dt> <dd class="svelte-vn5y90">${escape(busiestTimeOfDay)}</dd> </div><div class="svelte-vn5y90"><dt class="svelte-vn5y90" data-svelte-h="svelte-fzwpjs">Busiest Day of Week</dt> <dd class="svelte-vn5y90">${escape(busiestDay)}</dd></div></dl> <h3 data-svelte-h="svelte-132hjsr">Commits by time of day</h3> <svg viewBox="${"0 0 " + escape(width, true) + " " + escape(height, true)}" class="svelte-vn5y90"><g class="gridlines svelte-vn5y90" transform="${"translate(" + escape(usableArea.left, true) + ", 0)"}"${add_attribute("this", yAxisGridlines, 0)}></g><g transform="${"translate(0, " + escape(usableArea.bottom, true) + ")"}"${add_attribute("this", xAxis, 0)}></g><g transform="${"translate(" + escape(usableArea.left, true) + ", 0)"}"${add_attribute("this", yAxis, 0)}></g><g class="dots">${each(commits, (commit, index) => {
    return `<circle${add_attribute("cx", xScale(commit.datetime), 0)}${add_attribute("cy", yScale(commit.hourFrac), 0)}${add_attribute("r", rScale(commit.totalLines), 0)} fill="steelblue" fill-opacity="0.5" class="${["svelte-vn5y90", clickedCommits.includes(commit) ? "selected" : ""].join(" ").trim()}"></circle>`;
  })}</g></svg> <dl class="info tooltip svelte-vn5y90" ${"hidden"} style="${"top: " + escape(tooltipPosition.y, true) + "px; left: " + escape(tooltipPosition.x, true) + "px"}"${add_attribute("this", commitTooltip, 0)}><dt class="svelte-vn5y90" data-svelte-h="svelte-1vvf2xn">Commit</dt><dd class="svelte-vn5y90"><a${add_attribute("href", hoveredCommit.url, 0)} target="_blank">${escape(hoveredCommit.id)}</a></dd><dt class="svelte-vn5y90" data-svelte-h="svelte-dfuema">Date</dt><dd class="svelte-vn5y90">${escape(hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" }))}</dd><dt class="svelte-vn5y90" data-svelte-h="svelte-k4tc9n">Time</dt><dd class="svelte-vn5y90">${escape(hoveredCommit.datetime?.toLocaleString("en", { timeStyle: "short" }))}</dd><dt class="svelte-vn5y90" data-svelte-h="svelte-1xixum1">Author</dt><dd class="svelte-vn5y90">${escape(hoveredCommit.author)}</dd><dt class="svelte-vn5y90" data-svelte-h="svelte-rrneuy">Lines edited</dt><dd class="svelte-vn5y90">${escape(hoveredCommit.totalLines)}</dd></dl> ${validate_component(BarHorizontal, "BarHorizontal").$$render(
    $$result,
    {
      data: barData,
      title: clickedCommits.length > 0 ? "Selected Commits Breakdown" : "Website Breakdown"
    },
    {},
    {}
  )} 

&amp;&amp; --- IGNORE ---`;
});
export {
  Page as default
};
