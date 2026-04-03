import { c as create_ssr_component, f as escape, d as add_attribute, e as each, v as validate_component } from "../../chunks/ssr.js";
import * as d3 from "d3";
const ZipcodeMap_svelte_svelte_type_style_lang = "";
const css = {
  code: ".map-wrap.svelte-1buc86h{margin:1.5rem 0}h2.svelte-1buc86h{margin-bottom:0.2rem}.subtitle.svelte-1buc86h{color:#888;margin:0 0 0.75rem;font-size:0.9rem}.slider-row.svelte-1buc86h{display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;font-size:0.95rem}input[type=range].svelte-1buc86h{width:260px;cursor:pointer}svg.svelte-1buc86h{display:block;border:1px solid #ddd;border-radius:8px;background:#f0f0f0;cursor:grab}svg.svelte-1buc86h:active{cursor:grabbing}button.svelte-1buc86h{padding:3px 10px;font-size:0.85rem;cursor:pointer;border:1px solid #aaa;border-radius:4px;background:white}path.svelte-1buc86h{cursor:pointer;transition:opacity 0.1s}path.svelte-1buc86h:hover{opacity:0.8;stroke-width:2.5}.tooltip.svelte-1buc86h{background:rgba(0,0,0,0.82);color:#fff;padding:6px 10px;border-radius:5px;font-size:12px;line-height:1.6;pointer-events:none}",
  map: null
};
const WIDTH = 680;
const HEIGHT = 500;
const LEGEND_W = 180;
const N_BUCKETS = 7;
const ZipcodeMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let visibleGreenLine;
  let visibleStations;
  let allValues;
  let globalMin;
  let globalMax;
  let thresholds;
  let colorScale;
  let legendBuckets;
  let housingByZip;
  const TOTAL_W = WIDTH + LEGEND_W + 20;
  const ZIP_LABELS = {
    2138: "02138",
    2139: "02139",
    2140: "02140",
    2141: "02141",
    2142: "02142",
    2143: "02143",
    2144: "02144",
    2145: "02145",
    2155: "02155"
  };
  const YEARS = Array.from({ length: 26 }, (_, i) => 2e3 + i);
  const CITY_BASE_COLORS = {
    Cambridge: [37, 99, 235],
    // blue
    Somerville: [234, 88, 12],
    // orange
    Medford: [22, 163, 74]
    // green
  };
  const BRANCH_COLORS = {
    Trunk: "#00843D",
    B: "#E87722",
    C: "#00B2A9",
    D: "#DA291C",
    E: "#7C4D79",
    "GLX-D": "#00843D",
    "GLX-E": "#00843D"
  };
  let features = [];
  let housing = [];
  let greenLineFeatures = [];
  let stations = [];
  let pathGen;
  let year = 2025;
  let svgEl;
  let zoomTransform = "translate(0,0) scale(1)";
  let zoomK = 1;
  function getColor(zipNum, yr) {
    const zipStr = String(zipNum).padStart(5, "0");
    const entry = housingByZip[zipStr];
    const val = entry?.values?.[String(yr)];
    return val != null ? colorScale(val) : "#ccc";
  }
  $$result.css.add(css);
  visibleGreenLine = greenLineFeatures.filter((f) => f.properties.year_opened <= year);
  visibleStations = stations.filter((s) => s.year_opened <= year);
  allValues = housing.flatMap((d) => Object.values(d.values));
  globalMin = d3.min(allValues) ?? 0;
  globalMax = d3.max(allValues) ?? 1;
  thresholds = d3.range(N_BUCKETS - 1).map((i) => globalMin + (i + 1) * (globalMax - globalMin) / N_BUCKETS);
  colorScale = d3.scaleThreshold().domain(thresholds).range(d3.schemeBlues[N_BUCKETS]);
  legendBuckets = d3.range(N_BUCKETS).map((i) => [
    globalMin + i * (globalMax - globalMin) / N_BUCKETS,
    globalMin + (i + 1) * (globalMax - globalMin) / N_BUCKETS
  ]).reverse();
  housingByZip = Object.fromEntries(housing.map((d) => [d.zip, d]));
  return `<div class="map-wrap svelte-1buc86h"><h2 class="svelte-1buc86h" data-svelte-h="svelte-18zeufm">Home Values by ZIP Code</h2> <p class="subtitle svelte-1buc86h">Cambridge · Somerville · Medford  ·  ${escape(year)}</p> <div class="slider-row svelte-1buc86h"><span data-svelte-h="svelte-enup5l">Year:</span> <input type="range"${add_attribute("min", YEARS[0], 0)}${add_attribute("max", YEARS[YEARS.length - 1], 0)} step="1" class="svelte-1buc86h"${add_attribute("value", year, 0)}> <strong>${escape(year)}</strong> <button class="svelte-1buc86h" data-svelte-h="svelte-sg1zjc">Reset zoom</button></div> <svg${add_attribute("width", TOTAL_W, 0)}${add_attribute("height", HEIGHT, 0)} class="svelte-1buc86h"${add_attribute("this", svgEl, 0)}><g${add_attribute("transform", zoomTransform, 0)}>${each(features, (feature) => {
    let zip = feature.properties.ZCTA5CE20;
    return ` <path${add_attribute("d", pathGen?.(feature), 0)}${add_attribute("fill", getColor(zip, year), 0)} stroke="white" stroke-width="1.5" role="img"${add_attribute("aria-label", ZIP_LABELS[zip], 0)} class="svelte-1buc86h"></path>`;
  })}${each(visibleGreenLine, (segment) => {
    return `<path${add_attribute("d", pathGen?.(segment), 0)} fill="none"${add_attribute("stroke", BRANCH_COLORS[segment.properties.branch] ?? "#00843D", 0)}${add_attribute("stroke-width", 3 / zoomK, 0)} stroke-linecap="round" stroke-linejoin="round" role="img"${add_attribute("aria-label", segment.properties.name, 0)} class="svelte-1buc86h"></path>`;
  })}${each(visibleStations, (station) => {
    return ` ${``}`;
  })}${each(features, (feature) => {
    feature.properties.ZCTA5CE20;
    return `  ${``}`;
  })}</g><g transform="${"translate(" + escape(WIDTH + 20, true) + ", 20)"}"><text font-size="12" font-weight="bold" fill="currentColor">Home Value</text>${each(legendBuckets, ([lo, hi], i) => {
    return `<rect${add_attribute("x", 0, 0)}${add_attribute("y", 16 + i * 22, 0)} width="18" height="18"${add_attribute("fill", colorScale(lo + 1), 0)} stroke="#aaa" stroke-width="0.5"></rect> <text${add_attribute("x", 24, 0)}${add_attribute("y", 16 + i * 22 + 13, 0)} font-size="11" fill="currentColor">${escape(lo >= 1e6 ? "$" + (lo / 1e6).toFixed(2) + "M" : "$" + d3.format(",.0f")(lo))} –
          ${escape(hi >= 1e6 ? "$" + (hi / 1e6).toFixed(2) + "M" : "$" + d3.format(",.0f")(hi))}</text>`;
  })}<text font-size="11" font-weight="bold" fill="currentColor"${add_attribute("y", 16 + N_BUCKETS * 22 + 16, 0)}>City Labels</text>${each(Object.entries(CITY_BASE_COLORS), ([city, [r, g, b]], i) => {
    return `<circle${add_attribute("cx", 9, 0)}${add_attribute("cy", 16 + N_BUCKETS * 22 + 32 + i * 20, 0)} r="6" fill="${"rgb(" + escape(r, true) + "," + escape(g, true) + "," + escape(b, true) + ")"}"></circle> <text${add_attribute("x", 24, 0)}${add_attribute("y", 16 + N_BUCKETS * 22 + 37 + i * 20, 0)} font-size="11" fill="currentColor">${escape(city)}</text>`;
  })}</g>${``}${``}</svg> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(ZipcodeMap, "ZipcodeMap").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
