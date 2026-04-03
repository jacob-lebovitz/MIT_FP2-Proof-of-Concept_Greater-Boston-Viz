import { c as create_ssr_component, f as escape, d as add_attribute, v as validate_component, e as each } from "../../../chunks/ssr.js";
import { p as projects, P as Project } from "../../../chunks/Project.js";
import { b as base } from "../../../chunks/paths.js";
import * as d3 from "d3";
const Scrolly_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".scrolly.svelte-14jsymd{position:relative;display:grid;grid-template-columns:var(--scrolly-story-width, 1fr) var(--scrolly-viz-width, 1fr);grid-auto-flow:row dense;gap:var(--scrolly-gap, 4rem)}.viz.svelte-14jsymd,.story.svelte-14jsymd{grid-row:1}.viz.svelte-14jsymd{position:sticky;top:max(var(--scrolly-margin, 0) * 1px, var(--scrolly-viz-top, 2em));max-height:100vh}@container style(--scrolly-layout: viz-first){.scrolly.svelte-14jsymd{grid-template-columns:var(--scrolly-viz-width, 1fr) var(--scrolly-story-width, 1fr)}.viz.svelte-14jsymd{grid-column:1}.story.svelte-14jsymd{grid-column:2}}@container style(--scrolly-layout: overlap){.scrolly.svelte-14jsymd{grid-template-columns:1fr}.viz.svelte-14jsymd,.story.svelte-14jsymd{grid-column:1}}",
  map: null
};
const Scrolly = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { progress = 0 } = $$props;
  let { progressRaw = 0 } = $$props;
  let { threshold = 0.5 } = $$props;
  let { margin = 30 } = $$props;
  let { debounce = false } = $$props;
  let { throttle = false } = $$props;
  let container, vizContainer;
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.progressRaw === void 0 && $$bindings.progressRaw && progressRaw !== void 0)
    $$bindings.progressRaw(progressRaw);
  if ($$props.threshold === void 0 && $$bindings.threshold && threshold !== void 0)
    $$bindings.threshold(threshold);
  if ($$props.margin === void 0 && $$bindings.margin && margin !== void 0)
    $$bindings.margin(margin);
  if ($$props.debounce === void 0 && $$bindings.debounce && debounce !== void 0)
    $$bindings.debounce(debounce);
  if ($$props.throttle === void 0 && $$bindings.throttle && throttle !== void 0)
    $$bindings.throttle(throttle);
  $$result.css.add(css$3);
  return `<section class="scrolly svelte-14jsymd" style="${"--scrolly-margin: " + escape(margin, true)}"${add_attribute("this", container, 0)}><section class="story svelte-14jsymd">${slots.default ? slots.default({}) : ``}</section> <section class="viz svelte-14jsymd"${add_attribute("this", vizContainer, 0)}>${slots.viz ? slots.viz({}) : ``}</section> </section>`;
});
const ProjectNarrative_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".scrolly-wrapper.svelte-1phlwac.svelte-1phlwac{width:min(1000ch, 60vw);position:relative;left:50%;transform:translateX(-50%)}.step.svelte-1phlwac.svelte-1phlwac{min-height:80vh;padding:2rem}.step-content.svelte-1phlwac.svelte-1phlwac{border-left:3px solid var(--color-accent);padding:1.5rem 2rem}.project-detail.svelte-1phlwac.svelte-1phlwac{padding:2rem;width:100%}.project-detail.svelte-1phlwac img.svelte-1phlwac{width:100%}",
  map: null
};
const ProjectNarrative = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let activeProjectIdx;
  let scrollyProgress = 0;
  let sorted_projects = projects.sort((a, b) => a.year - b.year);
  let progressPerProject = 100 / sorted_projects.length;
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    activeProjectIdx = Math.min(sorted_projects.length - 1, Math.floor(scrollyProgress / progressPerProject));
    $$rendered = `<div class="scrolly-wrapper svelte-1phlwac">${validate_component(Scrolly, "Scrolly").$$render(
      $$result,
      { progress: scrollyProgress },
      {
        progress: ($$value) => {
          scrollyProgress = $$value;
          $$settled = false;
        }
      },
      {
        viz: () => {
          return `<div class="project-detail svelte-1phlwac"><h3>${escape(sorted_projects[activeProjectIdx].yearEnd ? `${sorted_projects[activeProjectIdx].year}–${sorted_projects[activeProjectIdx].yearEnd}` : sorted_projects[activeProjectIdx].year)}</h3> <img src="${escape(base, true) + "/" + escape(sorted_projects[activeProjectIdx].image, true)}"${add_attribute("alt", sorted_projects[activeProjectIdx].title, 0)} class="svelte-1phlwac"></div> `;
        },
        default: () => {
          return `${each(sorted_projects, (project) => {
            return `<section class="step svelte-1phlwac"><div class="step-content svelte-1phlwac"><h3>${escape(project.title)}</h3> <p>${escape(project.story)}</p></div> </section>`;
          })}`;
        }
      }
    )} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const Bar_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "svg.svelte-1ibdvkp{max-width:100%;height:auto;overflow:visible}.container.svelte-1ibdvkp{display:flex;align-items:center;gap:1rem}.legend.svelte-1ibdvkp{flex:1;list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.4rem}li.svelte-1ibdvkp{display:flex;align-items:center;gap:0.5rem}.swatch.svelte-1ibdvkp{width:12px;height:12px;background-color:var(--color);flex-shrink:0}.chart-title.svelte-1ibdvkp{font-size:1em;font-weight:bold;fill:currentColor}.axis-label.svelte-1ibdvkp{font-size:0.8em;fill:currentColor}.annotation.svelte-1ibdvkp{font-size:0.7em;fill:currentColor;font-style:italic}",
  map: null
};
let width = 400;
let height = 300;
const Bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let xScale;
  let yScale;
  let colorScale;
  let maxBar;
  let { data = [] } = $$props;
  let margin = {
    top: 40,
    right: 150,
    bottom: 80,
    left: 60
  };
  let innerWidth = width - margin.left - margin.right;
  let innerHeight = height - margin.top - margin.bottom;
  let xAxis, yAxis;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$1);
  xScale = d3.scaleBand().domain(data.map((d) => d.label)).range([0, innerWidth]).padding(0.2);
  yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) || 1]).range([innerHeight, 0]);
  colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(data.map((d) => d.label));
  maxBar = d3.greatest(data, (d) => d.value);
  return `<div class="container svelte-1ibdvkp"><svg viewBox="${"0 0 " + escape(width, true) + " " + escape(height, true)}" class="svelte-1ibdvkp"><text${add_attribute("x", margin.left + innerWidth / 2, 0)}${add_attribute("y", margin.top / 2, 0)} text-anchor="middle" class="chart-title svelte-1ibdvkp">Projects per Year
    </text><g transform="${"translate(" + escape(margin.left, true) + ", " + escape(margin.top + innerHeight, true) + ")"}"${add_attribute("this", xAxis, 0)}></g><g transform="${"translate(" + escape(margin.left, true) + ", " + escape(margin.top, true) + ")"}"${add_attribute("this", yAxis, 0)}></g><g transform="${"translate(" + escape(margin.left, true) + ", " + escape(margin.top, true) + ")"}">${each(data, (d) => {
    return `<rect${add_attribute("x", xScale(d.label), 0)}${add_attribute("y", yScale(d.value), 0)}${add_attribute("width", xScale.bandwidth(), 0)}${add_attribute("height", innerHeight - yScale(d.value), 0)}${add_attribute("fill", colorScale(d.label), 0)}></rect>`;
  })}${maxBar ? `<rect${add_attribute("x", xScale(maxBar.label), 0)}${add_attribute("y", yScale(maxBar.value), 0)}${add_attribute("width", xScale.bandwidth(), 0)}${add_attribute("height", innerHeight - yScale(maxBar.value), 0)} fill="none" stroke="currentColor" stroke-width="2"></rect> <line${add_attribute("x1", xScale(maxBar.label) + xScale.bandwidth(), 0)}${add_attribute("y1", yScale(maxBar.value) + (innerHeight - yScale(maxBar.value)) / 4, 0)}${add_attribute("x2", xScale(maxBar.label) + xScale.bandwidth() + 30, 0)}${add_attribute("y2", yScale(maxBar.value) + (innerHeight - yScale(maxBar.value)) / 4, 0)} stroke="currentColor" stroke-width="1"></line> <text${add_attribute("x", xScale(maxBar.label) + xScale.bandwidth() + 35, 0)}${add_attribute("y", yScale(maxBar.value) + (innerHeight - yScale(maxBar.value)) / 4, 0)} dominant-baseline="middle" class="annotation svelte-1ibdvkp">Year with most projects</text>` : ``}<text${add_attribute("x", innerWidth / 2, 0)}${add_attribute("y", innerHeight + margin.bottom - 40, 0)} text-anchor="middle" class="axis-label svelte-1ibdvkp">Year
      </text><text${add_attribute("x", -(innerHeight / 2), 0)}${add_attribute("y", -margin.left + 30, 0)} text-anchor="middle" transform="rotate(-90)" class="axis-label svelte-1ibdvkp">Number of Projects</text></g></svg> <ul class="legend svelte-1ibdvkp">${each(data, (d) => {
    return `<li style="${"--color: " + escape(colorScale(d.label), true)}" class="svelte-1ibdvkp"><span class="swatch svelte-1ibdvkp"></span> ${escape(d.label)} <em>(${escape(d.value)})</em> </li>`;
  })}</ul> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".outro.svelte-g2y110{margin-bottom:3rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let barData;
  let years = projects.map((proj) => proj.year);
  let range = Math.max(...years) - Math.min(...years);
  let wrangled = [];
  let percentages = [];
  $$result.css.add(css);
  barData = d3.rollups(projects, (v) => v.length, (d) => d.yearEnd).map(([year, count]) => ({ label: String(year), value: count }));
  return `${$$result.head += `<!-- HEAD_svelte-1en3a0b_START -->${$$result.title = `<title>Projects</title>`, ""}<!-- HEAD_svelte-1en3a0b_END -->`, ""} <h1>${escape(projects.length)} Projects over ${escape(range)} Years</h1> <p data-svelte-h="svelte-qhv7s5">Scroll down to see my a timeline of my projects and how they&#39;ve contributed to my professional and personal life</p> ${validate_component(Bar, "Bar").$$render($$result, { data: barData }, {}, {})} <section><h2 data-svelte-h="svelte-9f2un2">Data wrangling result</h2> <pre>${escape(JSON.stringify(wrangled, null, 2))}</pre> <h2 data-svelte-h="svelte-gef38h">Percentages</h2> <pre>${escape(JSON.stringify(percentages.map(([lang, pct]) => [lang, pct.toFixed(2) + "%"]), null, 2))}</pre></section> ${validate_component(ProjectNarrative, "ProjectNarrative").$$render($$result, {}, {}, {})} <p class="outro svelte-g2y110" data-svelte-h="svelte-1yig7vs">Thanks for scrolling through my project story! Feel free to explore all of the projects at your leisure below.</p> <div class="projects">${each(projects, (p) => {
    return `${validate_component(Project, "Project").$$render($$result, { data: p }, {}, {})}`;
  })}</div>  `;
});
export {
  Page as default
};
