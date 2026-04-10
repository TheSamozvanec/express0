'use strict'
export function getBySelector(...arr){return arr.map(selector=>document.querySelector(selector))}
