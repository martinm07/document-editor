// The ".mjs" extension of this file means "modular JavaScript".
//  It's understood by Node.js to know that this file uses the ECMAScript module system
//  (rather than CommonJS, which was the legacy module system created by Node.js).
// The ".cjs" extension would let Node know the module system the file uses is CommonJS.
// If Node has to execute a script with the ".js" extension, it chooses the module system based on `package.json` (which is default CommonJS unless it says `"type": "module",`).

import { rm } from 'node:fs/promises';
import { build } from 'vite';
import { exports } from 'resolve.exports';
import pkg from '../node_modules/svelte/package.json' with { type: 'json' };

import { resolve } from 'node:path';

const ENTRIES = [
	'svelte',
	'package.json',
	'animate',
	'attachments',
	'compiler',
	'easing',
	'internal',
	'internal/client',
	'internal/disclose-version',
	'internal/flags/async',
	'internal/flags/legacy',
	'internal/flags/tracing',
	'internal/server',
	'legacy',
	'motion',
	'reactivity',
	'reactivity/window',
	'server',
	'store',
	'transition',
	'events'
];

const IN_DIR = resolve(import.meta.dirname, '../node_modules/svelte');
const OUT_DIR = resolve(import.meta.dirname, '../src/lib/svelte/svelte-lib');

const entryObj = {};
for (const entry of ENTRIES) {
	const resolved = exports(pkg, entry === 'svelte' ? '.' : `./${entry}`, {
		browser: true
	});
	entryObj[entry] = resolve(IN_DIR, resolved[0]);
}

console.log(entryObj);

await rm(OUT_DIR, { recursive: true, force: true });

await build({
	configFile: false,
	logLevel: 'warn',
	// The output lands inside `public/`, so the public-dir copy step is off.
	publicDir: false,
	build: {
		outDir: OUT_DIR,
		emptyOutDir: true,
		lib: {
			entry: entryObj,
			formats: ['es']
		},
		rolldownOptions: {
			// Self-contained assets: nothing is external, so each file inlines
			// its shared modules (esm-env is defined as a production web build).
			external: []
		}
	}
});

console.log(`Built ${ENTRIES.length} runtime assets into ${OUT_DIR}/`);
