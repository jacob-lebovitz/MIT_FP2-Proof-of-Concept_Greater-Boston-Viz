import { c as create_ssr_component, b as subscribe, e as each, d as add_attribute, f as escape } from "../../chunks/ssr.js";
import { b as base } from "../../chunks/paths.js";
import { p as page } from "../../chunks/stores.js";
const style = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ":root{color-scheme:light dark}.color-scheme-switch.svelte-16rx84l.svelte-16rx84l{position:absolute;top:1rem;right:1rem;display:inline-flex;gap:4px;font-size:80%}nav.svelte-16rx84l a.current.svelte-16rx84l{border-bottom:0.4em solid oklch(80% 3% 200);padding-bottom:0.1em}nav.svelte-16rx84l.svelte-16rx84l{display:flex;margin-bottom:2em;border-bottom:1px solid oklch(80% 3% 200)}nav.svelte-16rx84l a.svelte-16rx84l{flex:1;text-decoration:none;color:inherit;text-align:center;padding:0.5em}nav.svelte-16rx84l a.svelte-16rx84l:hover{border-bottom:0.4em solid var(--color-accent);padding-bottom:0.1em}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let localStorage = globalThis.localStorage ?? {};
  let colorScheme = "light dark";
  if (localStorage.colorScheme) {
    colorScheme = localStorage.colorScheme;
  }
  let root = globalThis.document?.documentElement;
  let pages = [
    { url: "/", title: "About" },
    { url: "/projects", title: "Projects" },
    { url: "/resume", title: "Resume" },
    { url: "/contact", title: "Contact" },
    { url: "/meta", title: "Meta" },
    {
      url: "https://github.com/hiromitsdm",
      title: "Github"
    }
  ];
  $$result.css.add(css);
  {
    root?.style.setProperty("color-scheme", colorScheme);
  }
  localStorage.colorScheme = colorScheme;
  $$unsubscribe_page();
  return `<label class="color-scheme-switch svelte-16rx84l">Theme:
  <select><option value="light dark" data-svelte-h="svelte-9nlqsf">Automatic</option><option value="light" data-svelte-h="svelte-yop7ea">Light</option><option value="dark" data-svelte-h="svelte-6c4gk6">Dark</option></select></label> <nav class="svelte-16rx84l">${each(pages, (p) => {
    return ` <a${add_attribute("href", p.url.startsWith("http") ? p.url : base + p.url, 0)}${add_attribute("target", p.url.startsWith("http") ? "_blank" : null, 0)} class="${[
      "svelte-16rx84l",
      (p.url === "/" ? $page.url.pathname === base + "/" : $page.url.pathname.startsWith(
        base + p.url
        // if yes - set current = true if the path name matches. Else, set current = true if the path name starts correctly
      )) ? "current" : ""
    ].join(" ").trim()}">${escape(p.title)} </a>`;
  })}</nav> ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
