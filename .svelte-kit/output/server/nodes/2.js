

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.24700944.js","_app/immutable/chunks/scheduler.08babe91.js","_app/immutable/chunks/index.5bd3f010.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/2.328109b4.css"];
export const fonts = [];
