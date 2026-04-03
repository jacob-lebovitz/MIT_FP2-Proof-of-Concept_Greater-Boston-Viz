<script>
import { base } from "$app/paths";
import { page } from "$app/stores";
import { browser } from "$app/environment";
import "../style.css";

let pages = [
  {url: "/", title: "Main"},
  {url: "/team", title: "Team"},
];

let colorScheme = "light dark";

if (browser && localStorage.colorScheme) {
  colorScheme = localStorage.colorScheme;
}

let root = browser ? document.documentElement : null;
$: root?.style.setProperty("color-scheme", colorScheme);
$: if (browser) localStorage.colorScheme = colorScheme;
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
    <a href={p.url.startsWith("http") ? p.url : base + p.url}
        class:current={$page.url.pathname === (base + p.url)}
        target={p.url.startsWith("http") ? "_blank": null}
    >
     {p.title}
    </a>
  {/each}
</nav>

<slot />

<style>
.color-scheme-switch {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    gap: 4px;
    font-size: 80%;
}

nav {
    display: flex;
    margin-bottom: 2em;
    border-bottom: 1px solid oklch(80% 3% 200);
}

nav a {
    flex: 1;
    text-decoration: none;
    color: inherit;
    text-align: center;
    padding: 0.5em;
}

nav a.current {
    border-bottom: 0.4em solid oklch(80% 3% 200);
    padding-bottom: 0.1em;
}

nav a:hover {
    border-bottom: 0.4em solid var(--color-accent);
    padding-bottom: 0.1em;
}
</style>
