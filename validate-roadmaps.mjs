#!/usr/bin/env node
// Data-integrity guard for the templated platform onboarding roadmaps
// (OpenThaiAI_<platform>_Roadmap.html).
//
// Each templated roadmap is a live, Vercel-served static page. It shows a headline count in the
// form "<N> ขั้นตอน | <M> ส่วน" (N steps | M sections) and then lists its M sections as <h3>
// headings, each ending in its own per-section step count in parentheses, e.g.
// "ส่วนที่ 3 — เพิ่มสินค้า [AI] (7)". The headline N is authored separately from the section
// breakdown, so it can drift: a reader who adds up the parenthesised section counts must get
// exactly N, and must see exactly M <h3> sections. Nothing checked this and every one of these
// templated pages had drifted (headline N larger than the visible section sum), so each page
// contradicted its own content. Same class of bug — and same fix — as the products-*.json
// `totalProducts` drift that validate-products.mjs already guards: reconcile the headline to the
// detail actually shown, then pin it so it can't silently drift again.
//
// SCOPE: only the pipe-form template ("<N> ขั้นตอน | <M> ส่วน" + <h3>ส่วนที่…(k)</h3> sections).
// A handful of bespoke roadmaps for the biggest platforms (Facebook, Google, LINE, TikTok, …) use a
// different "<N> ขั้นตอน ใน <M> ส่วน" layout with <h2> sections and are already internally consistent;
// they are intentionally skipped here rather than force-fit to this template's assumptions.
//
// Run `node validate-roadmaps.mjs` (exit 0 = all good, 1 = a problem, printed per file). Stdlib only.
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter((f) => /Roadmap.*\.html$/.test(f)).sort();

let problems = 0;
let checked = 0;
let skipped = 0;
const fail = (file, msg) => { problems++; console.log(`  ❌ ${file}: ${msg}`); };

if (files.length === 0) { console.log('No *Roadmap*.html files found — nothing to validate.'); process.exit(1); }

console.log(`Scanning ${files.length} onboarding roadmaps\n`);

// The pipe-form headline is what marks a file as belonging to this template.
const PIPE_HEADLINE = /(\d+)\s*ขั้นตอน\s*\|\s*(\d+)\s*ส่วน/;

for (const file of files) {
  const html = readFileSync(join(dir, file), 'utf8');
  const headline = html.match(PIPE_HEADLINE);
  if (!headline) { skipped++; continue; } // bespoke ("ใน"-form) roadmap — not this guard's concern
  checked++;

  const headlineSteps = Number(headline[1]);
  const headlineSecs = Number(headline[2]);

  // Every "ส่วนที่ … (k)" section heading carries its own step count in trailing parentheses.
  const sectionCounts = [...html.matchAll(/<h3>\s*ส่วนที่[^<]*?\((\d+)\)\s*<\/h3>/g)].map((m) => Number(m[1]));
  const h3total = (html.match(/<h3>/g) || []).length;

  if (sectionCounts.length !== h3total) {
    fail(file, `${h3total} <h3> section(s) but only ${sectionCounts.length} match "ส่วนที่ … (N)" — every section heading must state its count`);
    continue;
  }
  if (headlineSecs !== h3total) {
    fail(file, `headline says ${headlineSecs} ส่วน but the page has ${h3total} <h3> section(s)`);
  }
  const sum = sectionCounts.reduce((a, b) => a + b, 0);
  if (headlineSteps !== sum) {
    fail(file, `headline says ${headlineSteps} ขั้นตอน but the ${sectionCounts.length} sections sum to ${sum}`);
  }
}

if (problems === 0) console.log(`  ✅ all ${checked} templated roadmaps: headline ขั้นตอน/ส่วน match their section breakdown  (${skipped} bespoke roadmap(s) skipped)`);
console.log(`\n=== RESULT: ${problems === 0 ? 'all templated roadmaps valid' : problems + ' problem(s) found'} ===`);
process.exit(problems === 0 ? 0 : 1);
