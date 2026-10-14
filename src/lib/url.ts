/**
 * Prefixes internal links with the site's base path, so the site works both
 * at a domain root and under a sub-path such as GitHub Pages.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}

export function isExternal(path: string): boolean {
  return /^https?:\/\//.test(path);
}

/** True when the current page is the given nav item (or inside its section). */
export function isCurrent(currentPath: string, navPath: string): boolean {
  const current = currentPath.replace(base, '').replace(/\/$/, '') || '/';
  const target = navPath.replace(/\/$/, '') || '/';
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}
