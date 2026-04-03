

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.d95e016b.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/Project.e3dc33e3.js","_app/immutable/chunks/paths.10262705.js","_app/immutable/chunks/transform.72d9954c.js"];
export const stylesheets = ["_app/immutable/assets/5.8667e650.css","_app/immutable/assets/Project.96be176c.css"];
export const fonts = [];
