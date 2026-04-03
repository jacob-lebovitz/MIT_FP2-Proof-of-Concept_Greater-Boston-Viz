import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.92177130.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/paths.10262705.js","_app/immutable/chunks/stores.9fce5055.js","_app/immutable/chunks/singletons.e8511b7f.js"];
export const stylesheets = ["_app/immutable/assets/0.6cb38275.css"];
export const fonts = [];
