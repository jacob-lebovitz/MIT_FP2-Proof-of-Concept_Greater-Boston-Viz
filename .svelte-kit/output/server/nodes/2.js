

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.55168295.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/Project.e3dc33e3.js","_app/immutable/chunks/paths.10262705.js"];
export const stylesheets = ["_app/immutable/assets/2.4a3a94f9.css","_app/immutable/assets/Project.96be176c.css"];
export const fonts = [];
