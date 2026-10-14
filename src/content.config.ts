/**
 * Content schemas.
 *
 * Every editable piece of the website lives in `src/content/` as a YAML file
 * and is validated against the schemas below when the site builds. If a field
 * is misspelled or has the wrong type, `npm run build` names the file and the
 * field.
 *
 * Text fields described as "markdown" accept simple Markdown: paragraphs
 * separated by a blank line, *emphasis*, **bold**, [links](/work/shrimppulse)
 * and bullet lists.
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
  '16/10',
  '21/9',
  '9/16',
  '9/19', // phone screen
  '210/297', // A4 portrait, for report previews and certificates
]);

/**
 * An image slot. Leave `src` empty and the site shows a labelled placeholder
 * frame; fill it in and the photograph appears, optimised, in the same frame.
 *
 *   src:         path inside src/assets/images, e.g. "portraits/messi.jpg"
 *   alt:         what the image shows, for screen readers (required once src is set)
 *   caption:     caption shown under the image: the occasion and your part in it (markdown)
 *   label:       short figure label shown in the corner, e.g. "Fig. 1" or "2026"
 *   annotation:  a one-line margin note in monospace, e.g. "Kasetsart, feeding trial 3"
 *   position:    CSS object-position used to crop, e.g. "50% 20%" keeps the top
 *   ratio:       overrides the frame's aspect ratio
 *   frame:       "none" (default), "phone" (device bezel), or "paper" (document edge)
 *   placeholder: the discreet label shown while the slot is empty
 *   published:   set to false to hide the slot entirely
 */
export const imageSchema = z.object({
  src: z.string().optional(),
  alt: z.string().default(''),
  caption: z.string().optional(),
  label: z.string().optional(),
  annotation: z.string().optional(),
  position: z.string().optional(),
  ratio: ratioSchema.optional(),
  frame: z.enum(['none', 'phone', 'paper']).default('none'),
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
  date: z.string().optional(),
  youtube: z.string().optional(), // e.g. https://www.youtube.com/watch?v=XXXX
  src: z.string().optional(), // e.g. /files/shrimppulse-demo.mp4
  caption: z.string().optional(),
  placeholder: z.string().optional(), // label for the empty frame, e.g. "Demonstration video"
  published: z.boolean().default(true),
});

/**
 * A short excerpt from a report or essay.
 *   title, date, attribution: shown as the excerpt's heading
 *   text:   the excerpt itself (markdown). Leave empty to show a labelled slot.
 *   href:   optional link to the full document (a PDF in public/files or a URL)
 */
export const excerptSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  attribution: z.string().optional(), // e.g. "From my IPO 2025 essay"
  text: z.string().optional(),
  href: z.string().optional(),
  hrefLabel: z.string().optional(),
  placeholder: z.string().default('Excerpt'),
  published: z.boolean().default(true),
});

/**
 * An optional audio or video recording. Hidden until `src` or `href` is set.
 */
export const recordingSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  caption: z.string().optional(), // the occasion, the piece, your part (markdown)
  kind: z.enum(['audio', 'video']).default('audio'),
  src: z.string().optional(), // file in public/, e.g. /files/guitar-recital-2026.mp3
  href: z.string().optional(), // or an external link (YouTube, SoundCloud)
  published: z.boolean().default(true),
});

/** A brief personal reflection. Hidden while `body` is empty. */
export const reflectionSchema = z.object({
  title: z.string().optional(),
  date: z.string().optional(),
  body: z.string().optional(), // markdown
  placeholder: z.string().optional(), // if set, an empty reflection shows a labelled slot instead of hiding
  published: z.boolean().default(true),
});

/** A dated update or current-work entry. */
export const datedEntrySchema = z.object({
  title: z.string(),
  date: z.string(), // "2026-10" or "2026-10-14"
  body: z.string().optional(), // markdown
  href: z.string().optional(),
  hrefLabel: z.string().optional(),
  status: z.enum(['active', 'archived']).default('active'),
  published: z.boolean().default(true),
});

/* ---------------------------------------------------------------------- */
/* Site-wide settings                                                      */
/* ---------------------------------------------------------------------- */

const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    firstName: z.string(),
    nickname: z.string(),
    surname: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    description: z.string(),
    location: z.string(),
    school: z.string(),
    grade: z.string(),
    cohort: z.string(),
    nav: z.array(z.object({ label: z.string(), href: z.string() })),
    /** The handwritten mark. Until src is set, the nickname is shown in text. */
    mark: imageSchema.optional(),
    linkedin: z.string().optional(),
    email: z.string().optional(),
    cv: linkSchema.optional(),
    ogImage: z.string().optional(),
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
    metaDescription: z.string().optional(),
    opening: z.object({
      eyebrow: z.string(),
      theme: z.string(),
      intro: z.string(), // markdown, short
      portrait: imageSchema,
      candids: z.array(imageSchema).max(2).default([]),
      primary: linkSchema,
      secondary: linkSchema,
    }),
    featured: z.object({
      eyebrow: z.string().optional(),
      lead: z.string(), // project id shown large
      leadNote: z.string().optional(), // one line under the lead project, markdown
      others: z.array(z.string()).max(2), // two smaller previews
    }),
    connections: z.object({
      heading: z.string(),
      intro: z.string().optional(),
    }),
    preview: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      href: z.string().optional(),
      linkLabel: z.string().optional(),
      images: z.array(imageSchema),
    }),
    milestones: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      ids: z.array(z.string()),
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
    currently: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      items: z.array(datedEntrySchema),
      showArchived: z.boolean().default(false),
    }),
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
    area: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    published: z.boolean().default(true),
    /** Picks the page composition: research, product, report, or device. */
    layout: z.enum(['research', 'product', 'report', 'device']).default('research'),
    status: z.object({
      label: z.string(),
      tone: z.enum(['active', 'complete', 'planned']).default('active'),
      note: z.string().optional(), // one sentence shown beside the status, markdown
    }),
    period: z.string().optional(),
    role: z.string().optional(),
    affiliation: z.string().optional(),
    card: imageSchema.optional(), // used on cards; falls back to hero
    hero: imageSchema.optional(), // the main photograph or screenshot
    figure: imageSchema.optional(), // a research figure, poster, or second image
    intro: z.string(), // markdown, short and always visible
    steps: z.array(z.object({ key: stepKeys, title: z.string(), body: z.string() })),
    /** Extra narrative sections (e.g. "Human fMRI work"), each with an optional image. */
    sections: z
      .array(
        z.object({
          id: z.string().optional(),
          eyebrow: z.string().optional(),
          heading: z.string(),
          body: z.string(), // markdown
          image: imageSchema.optional(),
          updates: z.array(datedEntrySchema).optional(),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    /** An example interaction (ShrimpPulse). Empty messages show a labelled slot. */
    interaction: z
      .object({
        heading: z.string(),
        intro: z.string().optional(),
        date: z.string().optional(),
        note: z.string().optional(), // e.g. "Translated from Thai; farm details removed"
        messages: z
          .array(z.object({ from: z.enum(['user', 'tool']), text: z.string() }))
          .default([]),
        placeholder: z.string().default('Example interaction'),
        published: z.boolean().default(true),
      })
      .optional(),
    excerpts: z.array(excerptSchema).optional(),
    excerptsHeading: z.string().optional(),
    timelineHeading: z.string().optional(),
    timeline: z.array(z.object({ date: z.string(), title: z.string(), body: z.string().optional() })).optional(),
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
    publications: z.array(z.string()).optional(),
    publicationsHeading: z.string().optional(),
    publicationsNote: z.string().optional(),
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
    authors: z.string().optional(),
    role: z.string(),
    contribution: z.string().optional(), // your specific part, once confirmed (markdown)
    summary: z.string().optional(),
    status: z.enum(['published', 'in-press', 'in-progress']).default('published'),
    citationVerified: z.boolean().default(false),
    published: z.boolean().default(true),
    notes: z.string().optional(),
  }),
});

/* ---------------------------------------------------------------------- */
/* Ideas & Expression (route: /beyond)                                     */
/* ---------------------------------------------------------------------- */

const beyond = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/beyond' }),
  schema: z.object({
    title: z.string(),
    lede: z.string(),
    order: z.number().default(99),
    published: z.boolean().default(true),
    body: z.string(), // markdown
    featureImage: imageSchema.optional(), // one larger photograph for the section
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
          description: z.string().optional(),
          href: z.string().optional(),
          published: z.boolean().default(true),
        }),
      )
      .optional(),
    excerpts: z.array(excerptSchema).optional(),
    excerptsHeading: z.string().optional(),
    gallery: z.array(imageSchema).optional(),
    galleryHeading: z.string().optional(),
    recordings: z.array(recordingSchema).optional(),
    recordingsHeading: z.string().optional(),
    recordingsPlaceholder: z.string().optional(), // label for the empty slot, e.g. "Recordings"
    video: videoSchema.optional(),
    reflection: reflectionSchema.optional(),
    notes: z.string().optional(),
  }),
});

/* ---------------------------------------------------------------------- */
/* Connections diagram                                                     */
/* ---------------------------------------------------------------------- */

const connections = defineCollection({
  loader: glob({ pattern: 'connections.yaml', base: './src/content' }),
  schema: z.object({
    prompt: z.string(), // shown before anything is selected
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        short: z.string().optional(), // shorter label for small screens
        kind: z.enum(['research', 'tool', 'idea']).default('research'),
        href: z.string(),
        linkLabel: z.string().optional(),
        blurb: z.string(), // one or two sentences, markdown
        x: z.number().min(0).max(100), // position in the diagram, percent
        y: z.number().min(0).max(100),
      }),
    ),
    edges: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        explanation: z.string(), // how the two connect, markdown
        note: z.string().optional(), // your own interpretation, shown when filled in
        href: z.string().optional(),
        linkLabel: z.string().optional(),
      }),
    ),
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
    date: z.string().optional(),
    dateLabel: z.string().optional(),
    organisation: z.string().optional(),
    outcome: z.string().optional(),
    description: z.string().optional(),
    details: z.array(z.string()).optional(),
    href: z.string().optional(),
    hrefLabel: z.string().optional(),
    image: imageSchema.optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    notes: z.string().optional(),
  }),
});

export const collections = { site, home, about, projects, publications, beyond, connections, milestones };
