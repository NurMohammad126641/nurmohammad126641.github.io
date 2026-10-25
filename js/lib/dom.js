export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms));
