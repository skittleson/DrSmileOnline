// Custom rehype plugin: adds rel="nofollow ugc noopener" and target="_blank"
// to outbound links pointing at the practice's legacy pre-migration content
// (doctorsmiledentalclinic.blogspot.com, medium.com/@drsmileonline247).
//
// These ~71 links live inline in ~69 blog post Markdown files and were
// authored as plain `[text](url)` — standard Markdown link syntax has no way
// to express a `rel` attribute, so this is applied post-parse at the HTML
// (hast) level instead of hand-editing every post.
import { visit } from 'unist-util-visit';

const LEGACY_LINK_HOSTS = [
  'doctorsmiledentalclinic.blogspot.com',
  'medium.com',
];

function isLegacyLink(href) {
  if (!href) return false;
  try {
    const url = new URL(href);
    return LEGACY_LINK_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

export function rehypeLegacyOutboundLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a' || !node.properties) return;
      if (!isLegacyLink(node.properties.href)) return;
      node.properties.rel = ['nofollow', 'ugc', 'noopener'];
      node.properties.target = '_blank';
    });
  };
}
