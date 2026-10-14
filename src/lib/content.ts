/**
 * Small helpers for reading the content collections with visibility and
 * ordering applied consistently.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { dateSortKey } from './dates';

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/content/site.yaml is missing');
  return entry.data;
}

export async function getPublishedProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects', ({ data }) => data.published);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublishedBeyond(): Promise<CollectionEntry<'beyond'>[]> {
  const all = await getCollection('beyond', ({ data }) => data.published);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublishedMilestones(): Promise<CollectionEntry<'milestones'>[]> {
  const all = await getCollection('milestones', ({ data }) => data.published);
  return all.sort((a, b) => dateSortKey(b.data.date).localeCompare(dateSortKey(a.data.date)));
}

export async function getPublishedPublications(): Promise<CollectionEntry<'publications'>[]> {
  const all = await getCollection('publications', ({ data }) => data.published);
  return all.sort((a, b) => b.data.year - a.data.year);
}

/** Resolves a list of ids to published entries, keeping the given order. */
export function pickByIds<T extends { id: string }>(entries: T[], ids: string[]): T[] {
  const byId = new Map(entries.map((e) => [e.id, e]));
  return ids.map((id) => byId.get(id)).filter((e): e is T => Boolean(e));
}

export const milestoneGroupLabels: Record<string, string> = {
  economics: 'Economics',
  philosophy: 'Philosophy',
  history: 'History',
  neuroscience: 'Neuroscience',
  speaking: 'Public speaking',
  recognition: 'Scholarships and recognition',
  music: 'Music',
};
