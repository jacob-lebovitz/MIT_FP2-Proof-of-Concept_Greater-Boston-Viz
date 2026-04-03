import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.72e071b4.js","_app/immutable/chunks/scheduler.08babe91.js","_app/immutable/chunks/index.5bd3f010.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/singletons.888509f4.js","_app/immutable/chunks/stores.1f03e4ea.js"];
export const stylesheets = ["_app/immutable/assets/0.7d87918f.css"];
export const fonts = [];
