

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/meta/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.9c4ffd1f.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/paths.10262705.js","_app/immutable/chunks/transform.72d9954c.js"];
export const stylesheets = ["_app/immutable/assets/4.5f376660.css"];
export const fonts = [];
