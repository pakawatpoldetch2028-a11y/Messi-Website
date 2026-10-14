/**
 * Dates in content files are plain strings: "2026", "2026-01" or
 * "2026-01-15". This keeps them easy to type and lets an entry carry only as
 * much precision as is known.
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatDate(date: string | undefined): string {
  if (!date) return '';
  const [y, m, d] = date.split('-');
  if (!y) return date;
  if (!m) return y;
  const month = MONTHS[Number(m) - 1] ?? m;
  if (!d) return `${month} ${y}`;
  return `${Number(d)} ${month} ${y}`;
}

/** Sort key: later dates first, undated entries last. */
export function dateSortKey(date: string | undefined): string {
  return date ? date.padEnd(10, '9') : '0000';
}

export function year(date: string | undefined): string {
  return date ? date.slice(0, 4) : '';
}
