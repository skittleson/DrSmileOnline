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
