import type { Tab } from '../store';
import pkg from '../../package.json';

import { transform } from '@babel/standalone';
import solid from 'babel-preset-solid';
import ts from '@babel/preset-typescript';
import { rollup } from 'rollup/dist/rollup.browser.js';

const SOLID_VERSION = pkg.dependencies['solid-js'].slice(1);
const CDN_URL = 'https://cdn.skypack.dev';
const tabsLookup: Map<string, Tab> = new Map();

export function loadBabel() {
  if (globalThis.$babel) return globalThis.$babel;

  globalThis.$babel = (code: string, opts: { babel: any; solid: any } = { babel: {}, solid: {} }) =>
    transform(code, {
      presets: [[solid, { ...opts.solid }], ts],
      ...opts.babel,
    });

  return globalThis.$babel;
}

/**
 * This function helps identify each section of the final compiled
 * output from the rollup concatenation.
 *
 * @param tab {Tab} - A tab
 */
function generateCodeString(tab: Tab) {
  return `// source: ${tab.name}.${tab.type}\n${tab.source}`;
}

/**
 * This is a custom rollup plugin to handle tabs as a
 * virtual file system and replacing every imports with a
 * ESM CDN import.
 *
 * Note: Passing in the Solid Version for letter use
 */
function virtual({ SOLID_VERSION, solidOptions = {} }) {
  return {
    name: 'repl-plugin',

    async resolveId(importee: string) {
      // This is a tab being imported
      if (importee.startsWith('.')) return importee;

      // This is an external module
      return {
        id: `${CDN_URL}/${importee.replace('solid-js', `solid-js@${SOLID_VERSION}`)}`,
        external: true,
      };
    },

    async load(id: string) {
      const tab = tabsLookup.get(id);
      return tab ? generateCodeString(tab) : null;
    },

    async transform(code: string, filename: string) {
      // Compile solid code
      if (/\.(j|t)sx$/.test(filename)) {
        const babel = loadBabel();
        return babel(code, { solid: solidOptions, babel: { filename } });
      }
    },
  };
}

async function compile(tabs: Tab[], solidOptions = {}) {
  try {
    for (const tab of tabs) {
      tabsLookup.set(`./${tab.name}.${tab.type}`, tab);
    }

    const compiler = await rollup({
      input: `./${tabs[0].name}.${tabs[0].type}`,
      plugins: [virtual({ SOLID_VERSION, solidOptions })],
    });

    const {
      output: [{ code }],
    } = await compiler.generate({ format: 'esm' });

    return [null, code as string] as const;
  } catch (e) {
    return [e.message, null] as const;
  }
}

self.addEventListener('message', async ({ data }) => {
  const { event, tabs, compileOpts } = data;

  switch (event) {
    case 'COMPILE':
      // @ts-ignore
      self.postMessage({
        event: 'RESULT',
        result: await compile(tabs, compileOpts),
      });
      break;
  }
});
