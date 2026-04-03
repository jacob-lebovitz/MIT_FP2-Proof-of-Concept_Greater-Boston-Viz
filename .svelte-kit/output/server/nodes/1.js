

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.515030ac.js","_app/immutable/chunks/scheduler.08babe91.js","_app/immutable/chunks/index.5bd3f010.js","_app/immutable/chunks/stores.1f03e4ea.js","_app/immutable/chunks/singletons.888509f4.js"];
export const stylesheets = [];
export const fonts = [];
