/**
 * Content schemas.
 *
 * Every editable piece of the website lives in `src/content/` as a YAML file
 * and is validated against the schemas below when the site builds. If a field
 * is misspelled or has the wrong type, `npm run build` will tell you which
 * file and which field.
 *
 * Text fields that say "markdown" accept simple Markdown: paragraphs separated
 * by a blank line, *emphasis*, **bold**, [links](https://example.com) and
 * bullet lists.
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

/* ---------------------------------------------------------------------- */
/* Shared field types                                                      */
/* ---------------------------------------------------------------------- */

/** Aspect ratios available for image frames. */
export const ratioSchema = z.enum([
  '1/1',
  '4/5',
  '3/4',
  '2/3',
  '4/3',
  '3/2',
  '16/9',
  '21/9',
  '9/16',
  '210/297', // A4 portrait, for report previews and certificates
]);

/**
 * An image slot. Leave `src` empty and the site shows a tasteful placeholder
 * frame instead; fill it in and the photograph appears, optimised, in the same
 * frame.
 *
 *   src:         path inside src/assets/images, e.g. "portraits/messi.jpg"
 *   alt:         what the image shows, for screen readers (required once src is set)
 *   caption:     optional caption shown under the image (markdown)
 *   position:    CSS object-position used to crop, e.g. "50% 20%" keeps the top
 *   ratio:       overrides the frame's aspect ratio
 *   placeholder: short label describing what belongs here while it is empty
 *   published:   set to false to hide the slot entirely
 */
export const imageSchema = z.object({
  src: z.string().optional(),
  alt: z.string().default(''),
  caption: z.string().optional(),
  position: z.string().optional(),
  ratio: ratioSchema.optional(),
  placeholder: z.string().optional(),
  published: z.boolean().default(true),
});

/** A link. `kind` only affects the small icon shown next to the label. */
export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  kind: z.enum(['external', 'paper', 'site', 'video', 'download', 'internal']).default('external'),
  published: z.boolean().default(true),
});

/** An optional embedded video. Provide either a YouTube URL or a file in public/. */
export const videoSchema = z.object({
  title: z.string().optional(),
  youtube: z.string().optional(), // e.g. https://www.youtube.com/watch?v=XXXX
  src: z.string().optional(), // e.g. /files/shrimppulse-demo.mp4
  poster: imageSchema.optional(),
  caption: z.string().optional(),
  published: z.boolean().default(true),
});

const reflectionSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(), // markdown; leave empty to hide the section
});

/* ---------------------------------------------------------------------- */
/* Site-wide settings                                                      */
/* ---------------------------------------------------------------------- */

const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    nickname: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    description: z.string(),
    location: z.string(),
    school: z.string(),
    cohort: z.string(),
    nav: z.array(z.object({ label: z.string(), href: z.string() })),
    linkedin: z.string().optional(),
    email: z.string().optional(),
    cv: linkSchema.optional(),
    ogImage: z.string().optional(), // path in public/, e.g. /files/og.jpg
    showPlaceholderLabels: z.boolean().default(true),
    footerNote: z.string().optional(),
  }),
});

/* ---------------------------------------------------------------------- */
/* Home page                                                               */
/* ---------------------------------------------------------------------- */

const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content' }),
  schema: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      intro: z.string(), // markdown
      portrait: imageSchema,
      primary: linkSchema,
      secondary: linkSchema,
    }),
    threads: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      items: z.array(
        z.object({
          title: z.string(),
          body: z.string(),
          href: z.string().optional(),
          linkLabel: z.string().optional(),
        }),
      ),
    }),
    featured: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      projects: z.array(z.string()), // project ids (file names without .yaml)
    }),
    milestones: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      ids: z.array(z.string()), // milestone ids from milestones.yaml
    }),
    question: z.object({
      quote: z.string(),
      body: z.string(), // markdown
      href: z.string().optional(),
      linkLabel: z.string().optional(),
    }),
  }),
});

/* ---------------------------------------------------------------------- */
/* About page                                                              */
/* ---------------------------------------------------------------------- */

const about = defineCollection({
  loader: glob({ pattern: 'about.yaml', base: './src/content' }),
  schema: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    heading: z.string(),
    portrait: imageSchema,
    opening: z.string(), // markdown
    interests: z.object({
      heading: z.string(),
      items: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    studies: z.object({
      heading: z.string(),
      programme: z.string(),
      items: z.array(z.string()),
      note: z.string().optional(),
    }),
    activityPhoto: imageSchema.optional(),
    questions: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      items: z.array(z.string()),
    }),
    directions: z.object({
      heading: z.string(),
      body: z.string(), // markdown
    }),
    reflection: reflectionSchema.optional(),
  }),
});

/* ---------------------------------------------------------------------- */
/* Research & Projects                                                     */
/* ---------------------------------------------------------------------- */

const stepKeys = z.enum(['question', 'approach', 'contribution', 'evidence', 'next']);

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    area: z.string(), // short category shown above the title
    summary: z.string(), // one or two sentences, used on cards
    order: z.number().default(99),
    published: z.boolean().default(true),
    status: z.object({
      label: z.string(),
      tone: z.enum(['active', 'complete', 'planned']).default('active'),
    }),
    period: z.string().optional(),
    role: z.string().optional(),
    affiliation: z.string().optional(),
    card: imageSchema.optional(), // image used on cards; falls back to hero
    hero: imageSchema.optional(),
    intro: z.string(), // markdown, short and always visible
    steps: z.array(
      z.object({
        key: stepKeys,
        title: z.string(),
        body: z.string(), // markdown
      }),
    ),
    timeline: z
      .array(
        z.object({
          date: z.string(),
          title: z.string(),
          body: z.string().optional(),
        }),
      )
      .optional(),
    timelineHeading: z.string().optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          note: z.string().optional(),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    galleries: z
      .array(
        z.object({
          heading: z.string(),
          description: z.string().optional(),
          columns: z.number().min(1).max(4).default(3),
          images: z.array(imageSchema),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    video: videoSchema.optional(),
    publications: z.array(z.string()).optional(), // ids from publications.yaml
    publicationsHeading: z.string().optional(),
    publicationsNote: z.string().optional(), // markdown
    links: z.array(linkSchema).optional(),
    related: z.array(linkSchema).optional(),
    notes: z.string().optional(), // private editing notes, never rendered
  }),
});

const publications = defineCollection({
  loader: file('./src/content/publications.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    year: z.number(),
    journal: z.string().optional(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().optional(),
    url: z.string(),
    authors: z.string().optional(), // full author list exactly as published
    role: z.string(), // e.g. "Co-author"
    summary: z.string().optional(), // markdown, one or two sentences
    status: z.enum(['published', 'in-press', 'in-progress']).default('published'),
    citationVerified: z.boolean().default(false),
    published: z.boolean().default(true),
    notes: z.string().optional(),
  }),
});

/* ---------------------------------------------------------------------- */
/* Beyond the Lab                                                          */
/* ---------------------------------------------------------------------- */

const beyond = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/beyond' }),
  schema: z.object({
    title: z.string(),
    lede: z.string(),
    order: z.number().default(99),
    published: z.boolean().default(true),
    body: z.string(), // markdown
    highlights: z
      .array(
        z.object({
          label: z.string(),
          detail: z.string().optional(),
          href: z.string().optional(),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    items: z
      .array(
        z.object({
          title: z.string(),
          role: z.string().optional(),
          period: z.string().optional(),
          description: z.string().optional(), // markdown
          href: z.string().optional(),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    gallery: z.array(imageSchema).optional(),
    galleryColumns: z.number().min(1).max(4).default(3),
    recordings: z
      .array(
        z.object({
          title: z.string(),
          kind: z.enum(['audio', 'video']).default('audio'),
          src: z.string().optional(), // file in public/, e.g. /files/guitar.mp3
          href: z.string().optional(), // or an external link (YouTube, SoundCloud)
          note: z.string().optional(),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    reflection: reflectionSchema.optional(),
    notes: z.string().optional(),
  }),
});

/* ---------------------------------------------------------------------- */
/* Milestones                                                              */
/* ---------------------------------------------------------------------- */

export const milestoneGroups = [
  'economics',
  'philosophy',
  'history',
  'neuroscience',
  'speaking',
  'recognition',
  'music',
] as const;

const milestones = defineCollection({
  loader: file('./src/content/milestones.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    group: z.enum(milestoneGroups),
    /** "2026", "2026-01" or "2026-01-15". Used for ordering and the default label. */
    date: z.string().optional(),
    /** Overrides the automatically formatted date, e.g. "Grades 9–10". */
    dateLabel: z.string().optional(),
    organisation: z.string().optional(),
    outcome: z.string().optional(),
    description: z.string().optional(), // markdown
    details: z.array(z.string()).optional(),
    href: z.string().optional(),
    hrefLabel: z.string().optional(),
    image: imageSchema.optional(), // certificate or event photograph
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    notes: z.string().optional(),
  }),
});

export const collections = { site, home, about, projects, publications, beyond, milestones };
