import { c as create_ssr_component, d as add_attribute, f as escape, e as each, v as validate_component } from "../../chunks/ssr.js";
import { P as Project, p as projects } from "../../chunks/Project.js";
const reading = [
  {
    title: "The Business of Platforms: Strategy in the Age of Digital Competition, Innovation, and Power",
    author: "Michael A. Cusumano, Annabelle Gawer, David B. Yoffie",
    image: "images/business-platforms.jpg"
  },
  {
    title: "Design for Manufacturability Handbook",
    author: "James G. Bralla",
    image: "images/dfm-handbook.jpg"
  },
  {
    title: "Product Design and Development",
    author: "Karl T. Ulrich, Steven D. Eppinger, Maria C. Yang",
    image: "images/product-design-dev.jpg"
  },
  {
    title: "Technology Roadmapping and Development: A Quantitative Approach to the Management of Technology",
    author: "Volker Schwienbacher, Gerhard Satzger, Torsten Krebs",
    image: "images/tech-roadmapping.jpg"
  },
  {
    title: "System Architecture: Strategy and Product Development for Complex Systems",
    author: "Edward Crawley, Bruce Cameron, Daniel Selva",
    image: "images/system-architecture.jpg"
  }
];
const ReadingItem_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "article.svelte-1knz5l9{display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.5rem}img.svelte-1knz5l9{width:80px;height:120px;object-fit:cover;flex-shrink:0}.info.svelte-1knz5l9{flex:1}h3.svelte-1knz5l9{margin:0 0 0.3rem 0;font-size:1.1rem;font-weight:bold;line-height:1.3}.author.svelte-1knz5l9{margin:0;font-size:0.95rem;color:#666}",
  map: null
};
const ReadingItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data = {} } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$1);
  return `<article class="svelte-1knz5l9"><img${add_attribute("src", data.image, 0)}${add_attribute("alt", data.title, 0)} class="svelte-1knz5l9"> <div class="info svelte-1knz5l9"><h3 class="svelte-1knz5l9">${escape(data.title)}</h3> <p class="author svelte-1knz5l9">${escape(data.author)}</p></div> </article>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".intro-section.svelte-em312n.svelte-em312n{display:flex;gap:3rem;margin-bottom:3rem;align-items:flex-start}.bio.svelte-em312n.svelte-em312n{flex:2}.reading-sidebar.svelte-em312n.svelte-em312n{flex:1;background-color:light-dark(#f5f5f5, black);padding:1.5rem;border-radius:8px}.reading-sidebar.svelte-em312n h2.svelte-em312n{margin-top:0;margin-bottom:1rem}.github-stats.svelte-em312n.svelte-em312n{border:1px solid light-dark(#ddd, #444);border-radius:8px;padding:1.5rem;margin-bottom:2rem}.github-stats.svelte-em312n h2.svelte-em312n{margin-top:0}.stats-grid.svelte-em312n.svelte-em312n{display:grid;grid-template-columns:repeat(4, 1fr)}.stats-grid.svelte-em312n dt.svelte-em312n{grid-row:1;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;color:light-dark(#666, #aaa)}.stats-grid.svelte-em312n dd.svelte-em312n{grid-row:2;margin:0;font-size:2rem;font-weight:bold}@media(max-width: 768px){.intro-section.svelte-em312n.svelte-em312n{flex-direction:column}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  fetch("https://api.github.com/users/hiromitsdm");
  $$result.css.add(css);
  return `<div class="intro-section svelte-em312n"><div class="bio svelte-em312n" data-svelte-h="svelte-1w6qstl"><h1>Hiro Ogasawara</h1> <p>Currently completing my dual master&#39;s in Engineering Management and Electrical Engineering &amp; Computer Science at MIT, I spent 2025 as an MIT-Riccio Engineering Leadership Resident at Apple Park, working on early-stage product architecture for next-generation products. That experience taught me that the best engineering isn&#39;t just about technical excellence—it&#39;s about navigating ambiguity, learning rapidly, and collaborating across functions to turn vision into reality. This builds on a decade at Toyota, where I learned what it really takes to ship great products at scale. Starting as a body design engineer in 2013, I progressed through roles spanning fuel tanks, underbody platforms, and exterior components (doors, hoods, fenders, bumpers) for vehicles ranging from 35,000-unit-per-month mass production to ultra-low-volume super sports cars. As Assistant Manager and TPS Lecturer, I led cross-functional teams across Japan, the US, and China, drove $10M+ in value engineering through a patented sealing structure, and improved design productivity by 25% by innovating visualization processes using the Toyota Production System. Toyota taught me that great engineering isn&#39;t just about CAD models and simulations—it&#39;s about the systems and workflows that eliminate waste and let engineers focus on work that actually matters. Now I&#39;m founding my own startup, applying those lessons to build tools that streamline engineering design projects.</p> <p>Outside of work, I&#39;m Co-GM of MIT Driverless, leading a 28-member team preparing for the Abu Dhabi Autonomous Racing League. I&#39;m also a competitive marathon runner who recently qualified for Boston with a 2:53:25 finish.</p> <img src="./images/headshot-Hiro.png" alt="Hiro Ogasawara"></div> <div class="reading-sidebar svelte-em312n"><h2 class="svelte-em312n" data-svelte-h="svelte-1gv99qj">What I&#39;m Reading</h2> <div class="reading">${each(reading, (book) => {
    return `${validate_component(ReadingItem, "ReadingItem").$$render($$result, { data: book }, {}, {})}`;
  })}</div></div></div> ${`<p data-svelte-h="svelte-qdsr2u">Loading...</p>`} <h2 data-svelte-h="svelte-oh8sfb">Latest Projects</h2> <div class="projects">${each(projects.slice(0, 3), (p) => {
    return `${validate_component(Project, "Project").$$render($$result, { data: p }, {}, {})}`;
  })} </div>`;
});
export {
  Page as default
};
