

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.47684b12.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js","_app/immutable/chunks/stores.9fce5055.js","_app/immutable/chunks/singletons.e8511b7f.js","_app/immutable/chunks/paths.10262705.js"];
export const stylesheets = [];
export const fonts = [];
