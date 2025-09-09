import { writable } from 'svelte/store';

export const userId = writable(null);
export const accountId = writable(null);
export const accounts = writable([]);