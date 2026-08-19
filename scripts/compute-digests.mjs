import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const indexPath = join(root, 'public/.well-known/agent-skills/index.json');

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
let failures = 0;

for (const skill of index.skills) {
  if (!skill.url) {
    console.error(`[digests] ${skill.name}: missing url`);
    failures++;
    continue;
  }
  const url = new URL(skill.url, 'https://skittleson.github.io');
  const path = url.pathname.replace(/^\/DrSmileOnline\//, '');
  const filePath = join(root, 'public', path);
  try {
    const content = readFileSync(filePath);
    const hash = createHash('sha256').update(content).digest('hex');
    skill.digest = `sha256:${hash}`;
    console.log(`[digests] ${skill.name}: sha256:${hash}`);
  } catch (err) {
    console.error(`[digests] ${skill.name}: ${err.message}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`[digests] ${failures} failure(s)`);
  process.exit(1);
}

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log('[digests] index.json updated');

// --- NAP guard -------------------------------------------------------------
// src/data/locations.ts is the single source of truth for every location's
// name/address/phone. Most consumers import it directly, but two static
// discovery files under public/ are copied verbatim to dist/ and cannot
// import TypeScript: llms.txt and .well-known/agent-skills/dr-smile-locations.md.
// They duplicate the NAP data. This guard fails the build if either file
// drifts from locations.ts, so the duplication can never go stale silently.
//
// locations.ts is parsed with a regex rather than imported so this stays
// dependency-free and works on the CI Node version (which may not strip TS
// types on import).
const locationsSrc = readFileSync(join(root, 'src/data/locations.ts'), 'utf8');

function extractField(block, field) {
  // Anchor the field name to a line start (after optional whitespace) so
  // `address` never accidentally matches `streetAddress` (or any future
  // `*address:`-suffixed field). Without the anchor the guard could silently
  // extract the wrong value.
  const match = block.match(new RegExp(`(?:^|\\n)\\s*${field}:\\s*'([^']*)'`));
  return match ? match[1] : null;
}

// Each location object spans from a `slug:` line to the next one (or the end
// of the array), which is enough to scope the field lookups per location.
const locationBlocks = locationsSrc
  .split(/(?=slug:\s*')/)
  .filter((block) => /slug:\s*'/.test(block));

const napLocations = locationBlocks.map((block) => ({
  slug: extractField(block, 'slug'),
  address: extractField(block, 'address'),
  phone: extractField(block, 'phone'),
}));

if (napLocations.length !== 4) {
  console.error(`[nap-guard] expected 4 locations in locations.ts, found ${napLocations.length}`);
  process.exit(1);
}

const napFiles = [
  'llms.txt',
  '.well-known/agent-skills/dr-smile-locations.md',
];

let napFailures = 0;
for (const relPath of napFiles) {
  const content = readFileSync(join(root, 'public', relPath), 'utf8');
  for (const loc of napLocations) {
    for (const field of ['address', 'phone']) {
      if (!content.includes(loc[field])) {
        console.error(
          `[nap-guard] ${relPath}: missing ${field} for "${loc.slug}" ` +
          `("${loc[field]}" from locations.ts). Update the static file to match.`,
        );
        napFailures++;
      }
    }
  }
}

if (napFailures > 0) {
  console.error(`[nap-guard] ${napFailures} NAP drift failure(s)`);
  process.exit(1);
}
console.log('[nap-guard] llms.txt + agent-skills locations match locations.ts');
