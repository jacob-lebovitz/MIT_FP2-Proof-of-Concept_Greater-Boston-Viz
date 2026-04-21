import { writable } from 'svelte/store';

export const currentYear = writable(2005);
// Developments map: dataset starts in 2011, so the story starts there too.
export const developmentsYear = writable(2011);
