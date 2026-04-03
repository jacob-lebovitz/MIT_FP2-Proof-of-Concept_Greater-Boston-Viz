<script>
import { base } from "$app/paths";
import { page } from "$app/stores";
import "../style.css";

let localStorage = globalThis.localStorage ?? {};
let colorScheme = "light dark";

if (localStorage.colorScheme) {
  colorScheme = localStorage.colorScheme;
}

let root = globalThis.document?.documentElement;
$: root?.style.setProperty("color-scheme", colorScheme);
$: localStorage.colorScheme = colorScheme;

let pages = [
  {url: "/", title: "About"},
  {url: "/projects", title: "Projects"},
  {url: "/resume", title: "Resume"},
  {url: "/contact", title: "Contact"},
  {url: "/meta", title: "Meta"},
  {url: "https://github.com/hiromitsdm", title: "Github"},
];
</script>

<label class="color-scheme-switch">
  Theme:
  <select bind:value={colorScheme}>
    <option value="light dark">Automatic</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>

<nav>
  {#each pages as p}
    <!-- <a href={base + p.url} -->
    <a href={p.url.startsWith("http") ? p.url : base + p.url}
        class:current={p.url === "/" // is this link the home page?
        ? $page.url.pathname === (base + "/") // if yes - set current = true if the path name matches. Else, set current = true if the path name starts correctly
        : $page.url.pathname.startsWith(base + p.url)}
        target={p.url.startsWith("http") ? "_blank": null}
    >
     {p.title}
    </a>
  {/each}
</nav>

<slot />

<style>
:root {
    color-scheme: light dark;
}

.color-scheme-switch {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    gap: 4px;
    font-size: 80%;
}

nav a.current {
    border-bottom: 0.4em solid oklch(80% 3% 200); /* Thick bottom border to highlight current page */
    padding-bottom: 0.1em; /* Reduce bottom padding to counter border height (0.5em - 0.4em = 0.1em) */
}

nav {
    display: flex;
    margin-bottom: 2em; /* Separate navigation from content below */
    border-bottom: 1px solid oklch(80% 3% 200); /* Subtle border under entire nav bar */
}

nav a {
    flex: 1;
    text-decoration: none; /* Remove underline */
    color: inherit; /* Use parent text color */
    text-align: center; /* Center the text */
    padding: 0.5em; /* Add spacing */
}

nav a:hover {
    border-bottom: 0.4em solid var(--color-accent); /* Use accent color on hover */
    padding-bottom: 0.1em; /* Reduce padding to counter border height */
}
</style>
