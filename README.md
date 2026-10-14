# Pakawat (Messi) Poldetch — personal website

A personal website for the college admissions process, built with
[Astro](https://astro.build) as a fast static site. All of the words, dates,
links, and image paths live in plain YAML files under `src/content/`, separate
from the layout code, so updating the site means editing text files and
dropping photographs into folders.

The design is a research journal crossed with a contemporary portfolio: cool
white pages, deep navy for text and a few dark sections, cobalt blue as the
main accent, teal as the second, and burnt orange for small warm details.
Headings are set in Manrope, text in Source Sans 3, and dates, figure labels
and annotations in JetBrains Mono. Everything tunable is in
`src/styles/global.css`.

## Checklist: where to add your material

| Material | Where it goes | Notes |
| --- | --- | --- |
| **Handwritten "Messi" mark** | `src/assets/images/marks/messi-mark.png`, referenced in `site.yaml` → `mark` | Already in place from your scan. Replace the file with a better scan at any time; clear `src` to fall back to the typed nickname. |
| **Portrait** | `src/content/home.yaml` → `opening.portrait`, `about.yaml` → `portrait` | Already in place. |
| **Two candid photographs (home)** | `home.yaml` → `opening.candids` | Lab work, a performance, a presentation, project testing. |
| **Home preview photographs** | `home.yaml` → `preview.images` | Music, speaking, competitions. Paths can repeat photos used on Ideas & Expression. |
| **Laboratory / pond photograph** | `projects/aquaculture-research.yaml` → `hero` | Use `caption` for the occasion and your part; `annotation` for a short note. |
| **Research figure or poster** | `projects/aquaculture-research.yaml` → `figure` | Shown with a paper edge beside the photograph. |
| **ShrimpPulse screenshot** | `projects/shrimppulse.yaml` → `hero` | Shown in a phone frame; a tall (about 9:19) screenshot fits best. |
| **ShrimpPulse example interaction** | `projects/shrimppulse.yaml` → `interaction.messages` | A real exchange, as a list of `from: user` / `from: tool` messages. |
| **Field photographs** | `projects/shrimppulse.yaml` → `galleries` | |
| **Neuron visualisation** | `projects/neuroscience.yaml` → `hero` | |
| **Report excerpt and PDF** | `projects/neuroscience.yaml` → `excerpts[0]` (`text`, `href`), PDF in `public/files/` | A report page image goes in `figure`. |
| **Human fMRI updates and figures** | `projects/neuroscience.yaml` → `sections[0].updates` and `sections[0].image` | Dated entries; set `status: archived` to retire one. |
| **Telesync device and app images** | `projects/telesync.yaml` → `hero` (device) and `figure` (app, phone-framed) | |
| **Demonstration videos** | `projects/*.yaml` → `video` (YouTube link or file in `public/files/`) | The frame shows a labelled placeholder until a source is set; no player appears without media. |
| **Performance photographs** | `beyond/music.yaml` → `featureImage` and `gallery` | |
| **Recordings** | `beyond/music.yaml` → `recordings` (title, date, caption, `src` or `href`) | Hidden until a source is set. |
| **What playing means to you** | `beyond/music.yaml` → `reflection.body` | |
| **TEDx / speaking photograph and video** | `beyond/communication.yaml` → `featureImage`, `video` | |
| **Competition photographs** | `beyond/*.yaml` → `gallery` | |
| **Essay excerpts** | `beyond/economics.yaml`, `beyond/history-philosophy.yaml` → `excerpts` | Title, date, attribution, `text`, optional `href` to the full essay. |
| **Personal reflections** | `about.yaml` → `reflection`, and `reflection` in each `beyond/*.yaml` | Each shows a labelled slot until `body` has text. Remove `placeholder` to hide an empty one instead. |
| **Current work** | `about.yaml` → `currently.items` | Dated; `status: archived` retires an entry, `showArchived: true` keeps showing them. |
| **Connections in your own words** | `connections.yaml` → each edge's `note` | Shown in the diagram panel when filled in. |
| **Certificates** | `milestones.yaml` → each entry's `image` | |
| **CV, email** | `site.yaml` → `cv`, `email` | Hidden until set. |

## Contents

0. [Checklist: where to add your material](#checklist-where-to-add-your-material)
1. [Running the site](#running-the-site)
2. [Where everything lives](#where-everything-lives)
3. [Editing text](#editing-text)
4. [Adding photographs](#adding-photographs)
5. [Updating projects](#updating-projects)
6. [Updating milestones](#updating-milestones)
7. [Publications](#publications)
8. [Ideas & Expression](#ideas--expression)
8a. [Connections diagram](#connections-diagram)
9. [Hiding and showing things](#hiding-and-showing-things)
10. [Files, videos, and recordings](#files-videos-and-recordings)
11. [Publishing the site](#publishing-the-site)
12. [Checking your work](#checking-your-work)

## Running the site

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
npm install        # once, to install dependencies
npm run dev        # starts a local preview at http://localhost:4321 that reloads as you edit
npm run build      # produces the finished site in dist/
npm run preview    # serves the built site from dist/
npm run check      # type-checks the templates
```

If a content file has a mistake (a misspelled field, a missing value), the
build stops and names the file and field. Fix it and run the command again.

## Where everything lives

```
src/content/              ← everything you will edit
  site.yaml               name, navigation, footer links (LinkedIn, email, CV)
  home.yaml               home page copy, portrait, featured work, highlighted milestones
  about.yaml              about page: portrait, interests, IB subjects, questions, directions
  projects/               one file per case study (Research & Projects)
    aquaculture-research.yaml
    shrimppulse.yaml
    neuroscience.yaml
    telesync.yaml
  publications.yaml       the papers, referenced by id from project files
  beyond/                 one file per Ideas & Expression section (route stays /beyond)
  connections.yaml        the interactive "how the pieces connect" diagram on the home page
  milestones.yaml         the dated record, grouped by discipline

src/assets/images/        ← photographs, by category (see the README inside); marks/ holds the handwritten mark
public/files/             ← PDFs, videos, audio (CV, reports, demos, recordings)

src/pages/                page templates (routes)
src/components/           reusable building blocks (Figure, Gallery, Timeline…)
src/layouts/Base.astro    the page shell: metadata, header, footer
src/styles/global.css     colours, fonts, spacing
src/content.config.ts     the schema every content file is checked against
```

## Editing text

Open the YAML file for the page and change the text. Two things to know:

- **Multi-paragraph text** uses a `|` block. Keep the indentation, and separate
  paragraphs with a blank line:

  ```yaml
  intro: |
    First paragraph.

    Second paragraph with *emphasis* and a [link](https://example.com).
  ```

- **Single-line text** that contains a colon or a quote should be wrapped in
  quotes: `title: "Young Smart: Young Tham Dee Award"`.

Simple Markdown works inside text fields: `*italics*`, `**bold**`,
`[links](/work/shrimppulse)` (internal links start with `/`), and bullet lists.

Fields named `notes` are private editing notes. They are never shown on the
site, so you can leave reminders to yourself there.

## Adding photographs

1. Save the photo into the matching folder under `src/assets/images/`
   (`portraits/`, `research/`, `shrimppulse/`, `telesync/`, `neuroscience/`,
   `music/`, `events/`, `certificates/`).
2. Find the image slot in the content file and fill it in:

   ```yaml
   hero:
     src: research/kasetsart-lab-2026.jpg   # path inside src/assets/images
     alt: Me at a bench in the fisheries laboratory, pipetting samples.
     caption: Feeding trial sampling day; I prepared and labelled the samples.
     annotation: Kasetsart University, 2026 # short monospace note above the caption
     label: Fig. 1                           # small corner label (optional)
     position: 50% 30%                       # which part to keep when cropped
     frame: none                             # none | phone | paper
   ```

   Write captions as the occasion plus your involvement. `frame: phone` draws
   a device bezel around a screenshot; `frame: paper` gives a document edge.

Every slot already exists with an empty `src`, showing a placeholder frame
until you fill it. `alt` describes the picture for screen readers; write it as
if telling someone what they would see. `position` controls cropping:
`50% 50%` keeps the centre, `50% 20%` keeps the top (good for portraits), and
`ratio` changes the frame shape if needed. Images are optimised automatically
at build time, so you can add full-resolution photographs.

If `src` points at a file that does not exist, the build prints a warning and
shows the placeholder instead of a broken image.

To add more slots to a gallery, copy an existing entry in the `images:` list.

## Updating projects

Each case study in `src/content/projects/` has the same shape:

| Field          | What it is                                                                |
| -------------- | ------------------------------------------------------------------------- |
| `title`, `area`, `summary` | Shown on cards and at the top of the page                     |
| `status`       | `label` (free text) and `tone`: `active`, `complete`, or `planned`        |
| `role`, `period`, `affiliation` | Shown in the metadata row; leave out any you don't want  |
| `hero`, `card` | Image slots for the page header and for cards                             |
| `layout`       | Page composition: `research`, `product`, `report`, or `device`            |
| `figure`       | A second image: research figure/poster, report preview, or app screens    |
| `intro`        | The short "In short" paragraph, always visible                            |
| `interaction`  | An example chatbot exchange (`messages` list); shows a slot while empty   |
| `excerpts`     | Report excerpts: title, date, attribution, `text`, optional `href`        |
| `sections`     | Extra narrative sections with an optional image and dated `updates`       |
| `steps`        | The case-study structure: `question`, `approach`, `contribution`, `evidence`, `next` |
| `timeline`     | Dated events (ShrimpPulse uses this)                                      |
| `metrics`      | Measured results, hidden until you add them                               |
| `galleries`    | Named groups of image slots                                               |
| `video`        | A YouTube link or a file in `public/files`                                |
| `publications` | Ids from `publications.yaml` to list on the page                          |
| `links`, `related` | Outbound links and links to other pages; hidden when empty            |
| `order`        | Position in the list (1 first)                                            |

To add a fifth project, copy one of the files, give it a new name (the file
name becomes the URL, e.g. `my-project.yaml` → `/work/my-project`), and add its
id to `featured.projects` in `home.yaml` if it should appear on the home page.

## Updating milestones

`src/content/milestones.yaml` is a list. Add a new entry anywhere in the file:

```yaml
- id: ineo-2027                      # unique; used for links like /milestones#ineo-2027
  title: International Neuroscience Olympiad
  group: neuroscience                 # economics | philosophy | history | neuroscience |
                                      # speaking | recognition | music
  date: 2027-07                       # "2027", "2027-07" or "2027-07-15"
  outcome: Silver medal
  organisation: International Neuroscience Olympiad   # optional
  description: One sentence of context.               # optional, markdown
  details:                                            # optional bullet list
    - First place, written exam
  href: /work/neuroscience            # optional link to a project or section
  hrefLabel: Read about the report
  image:                              # optional certificate or photograph
    src: certificates/ineo-2027.jpg
    alt: Certificate for the 2027 International Neuroscience Olympiad.
  featured: true                      # allows it on the home page (home.yaml picks by id)
  published: true
```

Entries are grouped by `group` and sorted newest first; undated entries sit at
the end of their group with an empty date column. Use `dateLabel` for a custom
label such as `Grades 9–10`. Certificates attached to milestones appear in the
gallery at the bottom of the milestones page.

## Publications

`src/content/publications.yaml` holds one entry per paper. Project pages list
papers by `id`. The three current entries use descriptive titles; replace each
`title` with the exact published title and add `authors`, `volume`, `issue`,
`pages`, and `doi` from the linked record, then set `citationVerified: true`
for your own records. Use `status: in-progress` for work that is not yet
published; it is labelled as such.

## Ideas & Expression

The page lives at `/beyond` (the route is unchanged so existing links work);
its navigation label is set in `site.yaml`. Each file in `src/content/beyond/`
is one section, in `order`, and renders only the material it has:

- `featureImage`: one larger photograph for the section
- `body`, `highlights` (label, detail, link), `items` (an activity with role and description)
- `excerpts`: essay excerpts (title, date, attribution, `text`, optional `href`)
- `gallery` and `galleryHeading`
- `recordings` (title, date, caption, `src` or `href`); `recordingsPlaceholder` labels the empty slot
- `video`: a YouTube link or file, e.g. for the TEDx talk
- `reflection`: a labelled slot until `body` has text

The volunteering and tutoring files are `published: false` until their
details are confirmed.

## Connections diagram

`src/content/connections.yaml` holds the nodes (your work and interests, with
positions in the diagram) and the edges between them, each with a short
explanation based on the content elsewhere on the site. Add your own
interpretation to an edge's `note` and it appears in the panel when that
connection is shown. The diagram works with mouse, touch and keyboard (arrow
keys move between topics, Escape clears), and the list beneath it works
without JavaScript.

## Hiding and showing things

Almost everything has a `published` field. Set it to `false` to keep an entry
out of the built site entirely: a project, a milestone, a publication, a
Beyond the Lab section, a single image slot, a link, or a gallery.

Other optional pieces hide themselves when empty:

- email, CV, and the LinkedIn link in `site.yaml`
- `links`, `related`, `metrics`, `video`, `recordings`
- `reflection`, `excerpts` and `interaction` show a labelled slot while empty;
  remove `placeholder` (or set `published: false`) to hide one instead
- the activity photograph on the about page (leave `src` empty)

The small labels inside empty image frames ("Laboratory photograph") can be
turned off before publishing with `showPlaceholderLabels: false` in
`site.yaml`.

## Files, videos, and recordings

Put PDFs, audio, and video in `public/files/` and reference them with a
site-relative path, e.g. `/files/h1-neuron-report.pdf`. For a CV, set `href`
in `site.yaml` under `cv` and set `published: true`. For a video, either paste
a YouTube link into `youtube:` or put a file at `src:`.

## Publishing the site

The site is static, so any static host works (Netlify, Vercel, Cloudflare
Pages, GitHub Pages). A GitHub Pages workflow is included in
`.github/workflows/deploy.yml`:

1. On GitHub, open **Settings → Pages** and set **Source** to "GitHub Actions".
   This step matters: the other option, "Deploy from a branch", makes GitHub
   run Jekyll over the source files, which fails on `.astro` components.
2. Push to the repository's default branch. The workflow builds the site and
   publishes it at `https://<your-username>.github.io/<repository-name>/`.

With a custom domain, set the `SITE_URL` environment variable in the workflow
to that domain and `BASE_PATH` to `/` (see the comments in
`astro.config.mjs`). The `site` value is used for the canonical URL, the social
preview, and the sitemap.

## Checking your work

- `npm run build` validates every content file and warns about image paths
  that do not match a file.
- `npm run dev` shows changes live while you edit.
- After adding photographs, look at each page on a phone-sized window and
  adjust `position` where a crop cuts off something important.
