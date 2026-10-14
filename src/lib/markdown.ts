/**
 * Renders the simple Markdown used in content files to HTML.
 * Supports paragraphs, emphasis, bold, links, lists, and line breaks.
 */
import { marked } from 'marked';

marked.use({
  gfm: true,
  breaks: false,
});

const renderer = new marked.Renderer();
const linkRenderer = renderer.link.bind(renderer);
renderer.link = function (token) {
  const html = linkRenderer(token);
  const external = /^https?:\/\//.test(token.href);
  return external ? html.replace(/^<a /, '<a rel="noopener" target="_blank" ') : html;
};

export function md(text: string | undefined | null): string {
  if (!text) return '';
  return marked.parse(text.trim(), { renderer }) as string;
}

/** Inline-only rendering (no surrounding <p>), for captions and short labels. */
export function mdInline(text: string | undefined | null): string {
  if (!text) return '';
  return marked.parseInline(text.trim(), { renderer }) as string;
}
