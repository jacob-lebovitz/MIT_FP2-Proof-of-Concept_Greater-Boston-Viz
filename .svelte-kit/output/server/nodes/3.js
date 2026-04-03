

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/contact/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.5ca13a0a.js","_app/immutable/chunks/scheduler.1c1a1096.js","_app/immutable/chunks/index.6ff5eb75.js"];
export const stylesheets = [];
export const fonts = [];
