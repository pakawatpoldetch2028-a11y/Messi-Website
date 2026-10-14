/**
 * Resolves image paths written in content files (for example
 * "portraits/messi.jpg") to the optimisable image modules inside
 * src/assets/images. If the file does not exist, `undefined` is returned and
 * the Figure component renders a placeholder frame instead of a broken image.
 */
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<ImageMetadata>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,gif,svg,JPG,JPEG,PNG}',
  { eager: true, import: 'default' },
);

const warned = new Set<string>();

export function resolveImage(src: string | undefined): ImageMetadata | undefined {
  if (!src) return undefined;
  const clean = src.replace(/^\/?(src\/assets\/images\/)?/, '').replace(/^\/+/, '');
  const key = `/src/assets/images/${clean}`;
  const found = modules[key];
  if (!found && !warned.has(key)) {
    warned.add(key);
    console.warn(
      `[images] "${src}" was not found in src/assets/images. A placeholder frame is shown instead.`,
    );
  }
  return found;
}

/** Lists every image currently available, for the content check script. */
export function availableImages(): string[] {
  return Object.keys(modules).map((k) => k.replace('/src/assets/images/', ''));
}
