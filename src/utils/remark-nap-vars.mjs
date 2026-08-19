// Custom remark plugin: replaces {{nap:field:slug}} tokens in blog-post
// Markdown with real NAP (Name/Address/Phone) data from src/data/locations.ts.
//
// Why this exists: blog posts are plain Markdown authored by hand, and
// several posts have shipped with a hardcoded phone number for the *wrong*
// city (e.g. a Lomita post citing the Newport Beach line) — a copy-paste
// error that's easy to make and easy to miss in review. Authoring with a
// token like {{nap:phone:lomita}} instead of a literal "(310) 539-1111"
// makes that class of error impossible: the value always comes from the
// single source of truth in locations.ts, and if a location's number ever
// changes, every post referencing it updates automatically on the next build.
//
// Supported fields: phone, address, website, name, hoursEn, hoursEs.
// Usage in Markdown: {{nap:phone:torrance}}, {{nap:address:lomita}}, etc.
import { visit } from 'unist-util-visit';
import { locations } from '../data/locations.ts';

const locationsBySlug = new Map(locations.map((loc) => [loc.slug, loc]));

const NAP_TOKEN = /\{\{nap:([a-zA-Z]+):([a-z-]+)\}\}/g;

function resolveNapToken(field, slug) {
  const location = locationsBySlug.get(slug);
  if (!location) {
    throw new Error(`remark-nap-vars: unknown location slug "${slug}" in {{nap:${field}:${slug}}}`);
  }
  if (!(field in location)) {
    throw new Error(`remark-nap-vars: unknown NAP field "${field}" in {{nap:${field}:${slug}}}`);
  }
  return location[field];
}

function replaceNapTokens(value) {
  return value.replace(NAP_TOKEN, (_match, field, slug) => resolveNapToken(field, slug));
}

export function remarkNapVars() {
  return (tree) => {
    // 'text' and 'html' cover ordinary prose; 'inlineCode' is included too
    // in case a token is ever wrapped in backticks (its content lives in
    // the same `.value` property) -- without it, a token would fail
    // silently instead of resolving or erroring.
    visit(tree, ['text', 'html', 'inlineCode'], (node) => {
      if (typeof node.value === 'string' && node.value.includes('{{nap:')) {
        node.value = replaceNapTokens(node.value);
      }
    });
    // Links written as [text](tel:{{nap:phone:torrance}}) or similar have
    // the token inside a node property (the URL), not a text child.
    visit(tree, 'link', (node) => {
      if (typeof node.url === 'string' && node.url.includes('{{nap:')) {
        node.url = replaceNapTokens(node.url);
      }
    });
  };
}
