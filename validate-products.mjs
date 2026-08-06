#!/usr/bin/env node
// Data-integrity guard for the regional product catalogs (products-<region>.json).
//
// Each file declares `totalProducts` and a `categories[]` list, where every category holds an
// `items[]` array of product names. `totalProducts` is hand-maintained, so it can silently drift
// from the actual number of items — a file that claims "62 products" but lists 60 misleads anyone
// (or any seed/import step) that trusts the header count. These files have no build/test step, so
// nothing caught that. This script pins the invariants; run `node validate-products.mjs` (exit 0 =
// all good, 1 = a problem, printed per file). Pure Node stdlib, no dependencies.
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter((f) => /^products-.+\.json$/.test(f)).sort();

let problems = 0;
const fail = (file, msg) => { problems++; console.log(`  ❌ ${file}: ${msg}`); };
const ok = (file, msg) => console.log(`  ✅ ${file}: ${msg}`);

if (files.length === 0) { console.log('No products-*.json files found — nothing to validate.'); process.exit(1); }

console.log(`Validating ${files.length} regional product catalogs\n`);

for (const file of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  } catch (e) {
    fail(file, `not valid JSON — ${e.message}`);
    continue;
  }

  // Schema: the four keys every catalog must carry.
  for (const key of ['continent', 'country', 'totalProducts', 'categories']) {
    if (!(key in data)) fail(file, `missing required key "${key}"`);
  }
  if (!Array.isArray(data.categories)) { fail(file, '"categories" is not an array'); continue; }
  if (!Number.isInteger(data.totalProducts) || data.totalProducts < 0) {
    fail(file, `"totalProducts" must be a non-negative integer (got ${JSON.stringify(data.totalProducts)})`);
  }

  // Every category must have a name and a non-empty items[] array of strings; count the items.
  let items = 0;
  data.categories.forEach((c, i) => {
    if (!c || typeof c.name !== 'string' || !c.name.trim()) fail(file, `categories[${i}] has no name`);
    if (!Array.isArray(c.items)) { fail(file, `categories[${i}] ("${c && c.name}") has no items[]`); return; }
    if (c.items.length === 0) fail(file, `categories[${i}] ("${c.name}") has an empty items[]`);
    if (!c.items.every((it) => typeof it === 'string' && it.trim())) fail(file, `categories[${i}] ("${c.name}") has a blank/non-string item`);
    items += c.items.length;
  });

  // The header count must equal the real number of items.
  if (Number.isInteger(data.totalProducts) && data.totalProducts !== items) {
    fail(file, `totalProducts (${data.totalProducts}) ≠ actual item count (${items})`);
  } else if (Number.isInteger(data.totalProducts)) {
    ok(file, `${data.country} — ${data.totalProducts} products across ${data.categories.length} categories`);
  }
}

console.log(`\n=== RESULT: ${problems === 0 ? 'all catalogs valid' : problems + ' problem(s) found'} ===`);
process.exit(problems === 0 ? 0 : 1);
